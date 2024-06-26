import React from 'react';
import dayjs from 'dayjs';
import Grid from '@mui/material/Grid';
import {
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Box,
} from '@mui/material';

import '../steps.scss';
import { useDispatch, useSelector } from 'react-redux';
import { CheckRounded } from '@mui/icons-material';
import {
  addSeedRedux, removeOptionRedux, removeSeedRedux,
  setMixRatioOptionRedux,
} from '../../../../features/calculatorSlice/actions';
import { initialOptions } from '../../../../shared/utils/calculator';
import { setHistoryStateRedux, setMaxAvailableStepRedux } from '../../../../features/userSlice/actions';
import { historyStates } from '../../../../features/userSlice/state';

const CheckBoxIcon = ({ style }) => (
  <Box sx={style}>
    <CheckRounded style={{
      color: '#FFFFFF',
      width: '28.5',
      height: '28.5',
    }}
    />

  </Box>
);

const PlantList = ({
  seedType,
  filteredSeeds,
}) => {
  const dispatch = useDispatch();

  const {
    acres, stateId, countyId, soilDrainage, plantingDate, soilFertility, council,
  } = useSelector((state) => state.siteCondition);
  const { historyState, maxAvailableStep } = useSelector((state) => state.user);

  const seedsSelected = useSelector((state) => state.calculator.seedsSelected);

  const seedsList = filteredSeeds.filter((seed) => seed.group !== null && seed.group.label === seedType);

  const checkPlantingDate = (seed) => {
    if (council === 'MCCC') return '';
    // FIXME: temp workaround, need check what plant have this problem
    if (!seed['Planting and Growth Windows']['Reliable Establishment']) return '';
    const [firstPeriod, secondPeriod] = seed['Planting and Growth Windows']['Reliable Establishment'];
    let secondStart; let secondEnd;
    const firstStart = dayjs(dayjs(firstPeriod.split(' - ')[0]).format('MM/DD'));
    const firstEnd = dayjs(dayjs(firstPeriod.split(' - ')[1]).format('MM/DD'));
    if (secondPeriod) {
      secondStart = dayjs(dayjs(secondPeriod.split(' - ')[0]).format('MM/DD'));
      secondEnd = dayjs(dayjs(secondPeriod.split(' - ')[1]).format('MM/DD'));
    }
    const plannedDate = dayjs(dayjs(plantingDate).format('MM/DD'));

    const inFirstPeriod = plannedDate.isBetween(firstStart, firstEnd, 'day', []);
    const inSecondPeriod = secondStart && plannedDate.isBetween(secondStart, secondEnd, 'day', []);

    if (inFirstPeriod || inSecondPeriod) return '';
    if (secondStart) {
      return `Seeding date outside of recommended window:
        ${firstStart.format('MM/DD')} - ${firstEnd.format('MM/DD')}, ${secondStart.format('MM/DD')} - ${secondEnd.format('MM/DD')}`;
    }
    return `Seeding date outside of recommended window:
      ${firstStart.format('MM/DD')} - ${firstEnd.format('MM/DD')}`;
  };

  seedsList.sort((a, b) => {
    const checkA = checkPlantingDate(a);
    const checkB = checkPlantingDate(b);

    if (checkA === '' && checkB !== '') {
      return -1;
    }
    if (checkA !== '' && checkB === '') {
      return 1;
    }
    return 0;
  });

  const checkSoilDrainage = (seed) => {
    if (council === 'MCCC') {
      if (seed.soilDrainage.map((s) => s.toLowerCase()).indexOf(soilDrainage.toLowerCase()) === -1) {
        return 'Selected soil drainage not recommended for this crop.';
      }
    }
    return '';
  };

  const handleClick = async (seed) => {
    // if from user history, set historyState to historyStates.updated to create a new calculation
    if (historyState === historyStates.imported) dispatch(setHistoryStateRedux(historyStates.updated));
    if (maxAvailableStep > 0) dispatch(setMaxAvailableStepRedux(0));
    const { id: cropId, label: seedName } = seed;
    // if seed not in seedSelected, add it
    if (seedsSelected.filter((s) => s.label === seedName).length === 0) {
      const url = `https://developapi.covercrop-selector.org/v2/crops/${cropId}?regions=${stateId}&context=seed_calc&regions=${countyId}`;
      const { data } = await fetch(url).then((res) => res.json());
      dispatch(addSeedRedux(data));
      const { label, attributes } = data;
      const percentSurvival = council === 'MCCC'
        ? parseFloat(attributes.Coefficients['% Live Seed to Emergence'].values[0])
        : '';
      const initOptions = {
        ...initialOptions,
        acres,
        soilDrainage,
        plantingDate,
        percentSurvival,
        soilFertility: soilFertility.toLowerCase(),
      };
      // set initial options
      // dispatch(setOptionRedux(label, initOptions));
      dispatch(setMixRatioOptionRedux(label, initOptions));
    } else {
    // if seed already in seedSelected, del it
      dispatch(removeSeedRedux(seedName));
      dispatch(removeOptionRedux(seedName));
    }
  };

  return (
    <Grid container spacing="1rem" pl="1rem">
      {seedsList.length === 0 ? (
        <Typography variant="h6">No available seeds in this type!</Typography>
      ) : (
        seedsList.map((seed, i) => (
          <Grid item key={i} position="relative">
            {seedsSelected.filter((s) => s.label === seed.label).length > 0 && (
              <CheckBoxIcon
                style={{
                  position: 'absolute',
                  right: '0.2rem',
                  top: '1.1rem',
                  zIndex: 1,
                  backgroundColor: '#5992E6',
                  borderTopRightRadius: '1rem',
                  borderBottomLeftRadius: '0.5rem',

                }}
              />
            )}
            <Card
              sx={{
                backgroundColor: 'transparent',
                border: 'none',
                boxShadow: 'none',
                width: '160px',
              }}
            >
              <CardActionArea
                onClick={() => {
                  // updated click function
                  handleClick(seed);
                }}
                disableRipple
              >
                <CardMedia
                  component="img"
                  height="160px"
                  image={
                    ((seed.thumbnail === null || seed.thumbnail === '')
                      ? 'https://placehold.it/250x150?text=Placeholder'
                      : seed.thumbnail)
                  }
                  alt={seed.label}
                  sx={{
                    border: '2px solid #4f5f30',
                    borderRadius: '1rem',

                    ...(seedsSelected.filter((s) => s.label === seed.label).length > 0 && {
                      border: '6px solid #5992E6',
                    }),
                  }}

                />
                <Typography
                  sx={{
                    color: 'primary.text',
                    position: 'absolute',
                    top: '2px',
                    left: 'calc(2px)',
                    right: 'calc(2px)',
                    ...(checkPlantingDate(seed) !== '' && {
                      height: '30px',
                      paddingTop: '5px',
                      fontSize: '0.790rem',
                    }),
                    borderTopLeftRadius: '0.9rem',
                    borderTopRightRadius: '0.9rem',
                    ...(seedsSelected.filter((s) => s.label === seed.label).length > 0
                    && checkPlantingDate(seed) !== ''
                    && {
                      left: 'calc(6px)',
                      right: 'calc(6px)',
                      top: '5px',
                      height: '28.5px',
                      borderTopLeftRadius: '0.68rem',
                      borderTopRightRadius: '0.68rem',
                      overflow: 'hidden',
                      fontSize: '0.790rem',
                      '& span': {
                        zIndex: 5,
                      },
                    }),
                    fontWeight: 'bold',
                    bgcolor: 'primary.light',
                    opacity: '90%',

                    paddingRight: '5px',
                    paddingLeft: '5px',

                  }}
                >
                  {
                    checkPlantingDate(seed) !== ''
                    && <span>Not Recommended</span>
                  }
                </Typography>

                <Typography
                  sx={{
                    color: 'primary.text',
                    position: 'absolute',
                    borderBottomLeftRadius: '0.9rem',
                    borderBottomRightRadius: '0.9rem',
                    top: '117px',
                    left: 'calc(2px)',
                    right: 'calc(2px)',
                    ...((checkPlantingDate(seed) !== '' || (checkSoilDrainage(seed) !== '')) && {
                      height: '41px',
                      ...(seedsSelected.filter((s) => s.label === seed.label).length > 0 && {
                        left: 'calc(6px)',
                        right: 'calc(6px)',
                        height: '41px',
                        top: '113px',
                        borderBottomLeftRadius: '0.62rem',
                        borderBottomRightRadius: '0.62rem',
                      }),
                    }),

                    fontStyle: 'italic',
                    fontWeight: 'bold',
                    bgcolor: 'primary.light',
                    opacity: '90%',
                    fontSize: '0.575rem',
                    paddingRight: '5px',
                    paddingLeft: '5px',
                    overflow: 'hidden',
                    whiteSpace: 'pre-line',

                  }}
                >
                  {checkPlantingDate(seed)}
                  {checkSoilDrainage(seed)}
                </Typography>

                <CardContent>
                  <Typography sx={{ fontWeight: 'bold' }}>
                    {seed.label}

                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default PlantList;
