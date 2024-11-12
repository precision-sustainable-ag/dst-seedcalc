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
import HelpIcon from '@mui/icons-material/Help';
import '../steps.scss';
import { useDispatch, useSelector } from 'react-redux';
import { PSATooltip } from 'shared-react-components/src';
import { CheckRounded } from '@mui/icons-material';
import {
  addSeedRedux, removeMixRatioOptionRedux, removeOptionRedux, removeSeedRedux,
  setMixRatioOptionRedux,
} from '../../../../features/calculatorSlice/actions';
import { initialOptions } from '../../../../shared/utils/calculator';
import { setHistoryStateRedux, setMaxAvailableStepRedux } from '../../../../features/userSlice/actions';
import { historyStates } from '../../../../features/userSlice/state';
import pirschAnalytics from '../../../../shared/utils/analytics';

const CheckBoxIcon = ({ style }) => (
  <Box sx={{
    ...style,
    position: 'absolute',
    right: '0.2rem',
    top: '1.1rem',
    zIndex: 1,
    backgroundColor: '#5992E6',
    borderTopRightRadius: '1rem',
    borderBottomLeftRadius: '0.5rem',
  }}
  >
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
  const { mixRatioOptions } = useSelector((state) => state.calculator);
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

  const checkSoilDrainage = (seed) => {
    if (council === 'MCCC') {
      if (seed.soilDrainage.map((s) => s.toLowerCase()).indexOf(soilDrainage.toLowerCase()) === -1) {
        return 'Selected soil drainage not recommended for this crop.';
      }
    }
    return '';
  };

  const checkCrop = (seed) => {
    if (council === 'MCCC') return checkSoilDrainage(seed);
    return checkPlantingDate(seed);
  };

  seedsList.sort((a, b) => {
    const checkA = checkCrop(a);
    const checkB = checkCrop(b);

    if (checkA === '' && checkB !== '') {
      return -1;
    }
    if (checkA !== '' && checkB === '') {
      return 1;
    }
    return 0;
  });

  const handleClick = async (seed) => {
    // if from user history, set historyState to historyStates.updated to create a new calculation
    if (historyState === historyStates.imported) dispatch(setHistoryStateRedux(historyStates.updated));
    if (maxAvailableStep > 0) dispatch(setMaxAvailableStepRedux(0));
    const { id: cropId, label: seedName } = seed;
    // if seed not in seedSelected, add it
    if (seedsSelected.filter((s) => s.label === seedName).length === 0) {
      const url = `https://${
        /(localhost|dev)/i.test(window.location) ? 'developapi' : 'api'
      }.covercrop-selector.org/v2/crops/${cropId}?regions=${stateId}&context=seed_calc&regions=${countyId}`;
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
      dispatch(setMixRatioOptionRedux(label, initOptions));
    } else {
    // if seed already in seedSelected, del it
      dispatch(removeSeedRedux(seedName));
      dispatch(removeMixRatioOptionRedux(seedName));
      dispatch(removeOptionRedux(seedName));
    }
    // reset percentOfRate in mixRatioOptions when there's any change in species selection
    seedsSelected.forEach((s) => {
      const seedOption = mixRatioOptions[s.label];
      dispatch(setMixRatioOptionRedux(s.label, { ...seedOption, percentOfRate: null }));
    });
    pirschAnalytics('Species Selection', {
      meta: { seedName },
    });
  };

  return (
    <Grid container spacing="1rem" pl="1rem">
      {seedsList.length === 0 ? (
        <Typography variant="h6">No available seeds in this type!</Typography>
      ) : (
        seedsList.map((seed, i) => (
          <Grid item key={i} position="relative">
            {seedsSelected.filter((s) => s.label === seed.label).length > 0 && (
              <CheckBoxIcon />
            )}
            <Card
              sx={{
                backgroundColor: 'transparent',
                border: 'none',
                boxShadow: 'none',
                width: '160px',
              }}
              data-test={`species-card-${seed.label}`}
            >
              <CardActionArea
                onClick={() => {
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

                {checkCrop(seed) !== ''
                && (
                  <>
                    <Typography
                      sx={{
                        color: 'primary.text',
                        position: 'absolute',
                        top: '2px',
                        left: 'calc(2px)',
                        right: 'calc(2px)',
                        borderTopLeftRadius: '0.9rem',
                        borderTopRightRadius: '0.9rem',
                        fontWeight: 'bold',
                        bgcolor: 'primary.light',
                        opacity: '90%',
                        paddingRight: '5px',
                        paddingLeft: '5px',
                        height: '30px',
                        paddingTop: '5px',
                        fontSize: '0.790rem',
                        ...(seedsSelected.filter((s) => s.label === seed.label).length > 0
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
                      }}
                    >
                      { checkCrop(seed) !== '' && <span>Not Recommended</span> }
                    </Typography>

                    <PSATooltip
                      title={checkCrop(seed)}
                      arrow
                      placement="bottom-end"
                      enterTouchDelay={200}
                      leaveTouchDelay={200}
                      componentsProps={{
                        tooltip: {
                          sx: {
                            width: '150px',
                          },
                        },
                      }}
                      tooltipContent={(
                        <HelpIcon sx={{
                          color: 'primary.light',
                          position: 'absolute',
                          right: '10px',
                          top: '120px',
                          fontSize: '2rem',
                        }}
                        />
                    )}
                    />
                  </>
                )}

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
