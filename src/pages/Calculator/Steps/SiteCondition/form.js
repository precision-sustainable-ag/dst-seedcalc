/// ///////////////////////////////////////////////////////
//                      Imports                         //
/// ///////////////////////////////////////////////////////

import React, { useEffect, useState } from 'react';
import {
  Typography, Tooltip,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import InfoIcon from '@mui/icons-material/Info';

import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import DatePicker from '../../../../components/DatePicker';
import Dropdown from '../../../../components/Dropdown';
import NumberTextField from '../../../../components/NumberTextField';
import DSTSwitch from '../../../../components/Switch';
import {
  soilDrainagesMCCC, soilDrainagesNECCC, soilFertilityValues,
} from '../../../../shared/data/dropdown';
import { getCrops } from '../../../../features/stepSlice/api';
import '../steps.scss';
import {
  checkNRCSRedux,
  setAcresRedux, setCountyRedux, setPlantingDateRedux, setSoilDrainageRedux, setSoilFertilityRedux, updateTileDrainageRedux,
} from '../../../../features/siteConditionSlice/actions';

const needTileDrainage = ['Very Poorly Drained', 'Poorly Drained', 'Somewhat Poorly Drained'];

const getTileDrainage = (council, currentDrainage) => {
  if (council === 'MCCC') {
    switch (currentDrainage) {
      case 'Very Poorly Drained':
        return 'Somewhat Poorly Drained';
      case 'Poorly Drained':
        return 'Moderately Well Drained';
      case 'Somewhat Poorly Drained':
        return 'Moderately Well Drained';
      default:
        return '';
    }
  }
  if (council === 'NECCC') {
    switch (currentDrainage) {
      case 'Very Poorly Drained':
        return 'Poorly Drained';
      case 'Poorly Drained':
        return 'Somewhat Poorly Drained';
      case 'Somewhat Poorly Drained':
        return 'Moderately Well Drained';
      default:
        return '';
    }
  }
  return '';
};

const SiteConditionForm = ({
  council,
  counties,
}) => {
  const [soilDrainagePrev, setSoilDrainagePrev] = useState('');
  const dispatch = useDispatch();
  const {
    soilDrainage, tileDrainage, county, plannedPlantingDate,
    acres, soilFertility, checkNRCSStandards,
  } = useSelector((state) => state.siteCondition);

  const handleRegion = (region) => {
    const countyId = counties.filter((c) => c.label === region)[0].id;
    dispatch(setCountyRedux(region));
    if (countyId !== undefined && countyId !== undefined) {
      dispatch(
        getCrops({
          regionId: countyId,
        }),
      );
    }
  };

  const handleSoilDrainage = (e) => {
    console.log('handleSoilDrainage');
    setSoilDrainagePrev(e.target.value);
    dispatch(setSoilDrainageRedux(e.target.value));
    dispatch(updateTileDrainageRedux(false));
  };

  const handleTileDrainage = () => {
    console.log('handleTileDrainage');
    dispatch(updateTileDrainageRedux(!tileDrainage));
  };

  useEffect(() => {
    if (!tileDrainage) {
      setSoilDrainagePrev(soilDrainage);
    }
  }, [soilDrainage]);

  useEffect(() => {
    if (tileDrainage) {
      console.log('soilDrainage', soilDrainage);
      const newDrainage = getTileDrainage(council, soilDrainage);
      console.log('newDrainage', newDrainage);
      dispatch(setSoilDrainageRedux(newDrainage));
    }
    if (!tileDrainage && soilDrainagePrev !== '') {
      dispatch(setSoilDrainageRedux(soilDrainagePrev));
    }
  }, [tileDrainage]);

  return (
    <>
      {/* County / Zone */}
      <Grid item xs={12} md={6} p="10px">
        <Dropdown
          value={county}
          label={
            council === 'MCCC' ? 'County: ' : 'USDA Plant Hardiness Zone: '
          }
          handleChange={(e) => handleRegion(e.target.value)}
          size={12}
          items={counties}
        />
      </Grid>

      {/* Soil Drainage */}
      <Grid item xs={12} md={6} p="10px">
        <Dropdown
          value={soilDrainagePrev}
          label="Soil Drainage: "
          handleChange={handleSoilDrainage}
          size={12}
          // eslint-disable-next-line no-nested-ternary
          items={council === 'MCCC' ? soilDrainagesMCCC : council === 'NECCC' ? soilDrainagesNECCC : []}
        />
      </Grid>

      {/* Tile Drainage */}
      <Grid item xs={12} md={6} p="10px">
        <Grid container alignItems="center">
          <Grid item xs={4}>
            <Grid container direction="column">
              <Grid item>
                <Typography>
                  Tile drainage
                  <Tooltip
                    type="text"
                    title={(
                      <Typography color="primary.light">
                        Indicate if the field of interest has tile installed.
                        If you have selected very poorly to somewhat poorly drained soils,
                        selecting “yes” will increase your drainage class.
                      </Typography>
                  )}
                  >
                    <InfoIcon fontSize="1rem" />
                  </Tooltip>
                </Typography>
              </Grid>
              <Grid item>
                <Typography display="inline">
                  No
                </Typography>
                <DSTSwitch
                  checked={tileDrainage}
                  handleChange={handleTileDrainage}
                  disabled={!tileDrainage && (needTileDrainage.indexOf(soilDrainage) === -1 || council === '')}
                />
                <Typography display="inline">
                  Yes
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={8}>
            {!tileDrainage && (needTileDrainage.indexOf(soilDrainage) === -1 || council === '')
              ? <Typography>Tile Drainage not available.</Typography>
              : (
                tileDrainage && (
                <>
                  <Typography>Your improved drainage class is: </Typography>
                  <Typography fontWeight="bold">{soilDrainage}</Typography>
                </>
                )
              )}

          </Grid>
        </Grid>

      </Grid>

      {/* Planting Date */}
      <Grid item xs={12} md={6} p="10px">
        <DatePicker
          label="Planned Planting Date: "
          value={plannedPlantingDate}
          handleChange={(e) => {
            const formattedDate = dayjs(e).format('MM/DD/YYYY');
            dispatch(setPlantingDateRedux(formattedDate));
          }}
        />
      </Grid>

      {/* Acres */}
      <Grid item xs={12} md={6} p="10px">
        <NumberTextField
          value={acres}
          label="Acres"
          disabled={false}
          handleChange={(e) => {
            dispatch(setAcresRedux(parseFloat(e.target.value)));
          }}
          placeholder="Enter your field acres here"
        />
      </Grid>

      {/* NRCS Standards */}
      {council === 'MCCC' && (
        <Grid
          item
          xs={6}
          p="1rem"
          display="flex"
          justifyContent="center"
        >
          <Typography fontSize="1.25rem">Check NRCS Standards: </Typography>
          <DSTSwitch
            checked={checkNRCSStandards}
            handleChange={() => {
              dispatch(checkNRCSRedux(!checkNRCSStandards));
            }}
          />
        </Grid>
      )}

      {/* Soil Fertility */}
      {council === 'NECCC' && (
        <Grid
          item
          xs={6}
          p="10px"
        >
          <Dropdown
            value={soilFertility}
            label="Soil Fertility: "
            handleChange={(e) => {
              dispatch(setSoilFertilityRedux(e.target.value));
            }}
            size={12}
            items={soilFertilityValues}
          />
        </Grid>
      )}
    </>
  );
};

export default SiteConditionForm;
