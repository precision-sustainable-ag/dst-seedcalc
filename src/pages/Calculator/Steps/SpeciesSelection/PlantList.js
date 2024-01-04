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
import {
  addSeedRedux, setOptionRedux, removeOptionRedux, removeSeedRedux,
} from '../../../../features/calculatorSlice/actions';
import { initialOptions } from '../../../../shared/utils/calculator';

const CheckBoxIcon = ({ style }) => (
  <Box sx={style}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 18 18"
      fill="none"
    >
      <path
        d="M14 0H4C1.79086 0 0 1.79086 0 4V14C0 16.2091 1.79086 18 4 18H14C16.2091 18 18 16.2091 18 14V4C18 1.79086 16.2091 0 14 0Z"
        fill="#5992E6"
      />
      <path
        d="M6 9L8.25 11L12 7"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </Box>
);

const PlantList = ({
  seedType,
  filteredSeeds,
}) => {
  const dispatch = useDispatch();

  const {
    acres, stateId, countyId, soilDrainage, plannedPlantingDate, soilFertility, council,
  } = useSelector((state) => state.siteCondition);

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
    const plannedDate = dayjs(dayjs(plannedPlantingDate).format('MM/DD'));

    if (!plannedDate.isBetween(firstStart, firstEnd, 'day')) {
      if (
        secondStart
        && !plannedDate.isBetween(secondStart, secondEnd, 'day')
      ) {
        return `Seeding date outside of recommended window: ${firstStart.format(
          'MM/DD',
        )} - ${firstEnd.format('MM/DD')}, ${secondStart.format(
          'MM/DD',
        )} - ${secondEnd.format('MM/DD')}`;
      }
      return `Seeding date outside of recommended window: ${firstStart.format(
        'MM/DD',
      )} - ${firstEnd.format('MM/DD')}`;
    }
    return '';
  };

  const handleClick = async (seed) => {
    const { id: cropId, label: seedName } = seed;
    // if seed not in seedSelected, add it
    if (seedsSelected.filter((s) => s.label === seedName).length === 0) {
      const url = `https://developapi.covercrop-selector.org/v2/crops/${cropId}?regions=${stateId}&context=seed_calc&regions=${countyId}`;
      const { data } = await fetch(url).then((res) => res.json());
      dispatch(addSeedRedux(data));
      const { label, attributes } = data;
      const percentSurvival = council === 'MCCC'
        ? parseFloat(attributes.Coefficients['% Chance of Winter Survial'].values[0])
        : '';
      // set initial options
      dispatch(setOptionRedux(label, {
        ...initialOptions,
        acres,
        soilDrainage,
        plannedPlantingDate,
        percentSurvival,
        soilFertility: soilFertility.toLowerCase(),
      }));
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
                  right: '-0.5rem',
                  top: '0.5rem',
                  zIndex: 1,
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
                    seed.thumbnail
                    ?? 'https://placehold.it/250x150?text=Placeholder'
                  }
                  alt={seed.label}
                  sx={{ border: '2px solid green', borderRadius: '1rem' }}
                />

                <Typography
                  sx={{
                    color: '#DA7059',
                    position: 'absolute',
                    top: '1rem',
                    fontStyle: 'italic',
                    fontWeight: 'bold',
                    bgcolor: 'primary.light',
                    opacity: '80%',
                    fontSize: '0.875rem',
                  }}
                >
                  {checkPlantingDate(seed)}
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
