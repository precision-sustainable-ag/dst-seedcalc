/// ///////////////////////////////////////////////////////
//                      Imports                         //
/// ///////////////////////////////////////////////////////

import React, { useEffect, useState } from 'react';
import {
  Button,
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
  soilDrainagesMCCC, soilDrainagesNECCC, soilFertilityValues, soilDrainageValues,
} from '../../../../shared/data/dropdown';
import {
  checkNRCSRedux,
  setCouncilRedux, setCountyIdRedux, setStateRedux, updateLatlonRedux,
  setAcresRedux, setCountyRedux, setPlantingDateRedux, setSoilDrainageRedux,
  setSoilFertilityRedux, updateTileDrainageRedux,
} from '../../../../features/siteConditionSlice/actions';
import { getRegion } from '../../../../features/siteConditionSlice/api';
import statesLatLongDict from '../../../../shared/data/statesLatLongDict';
import '../steps.scss';

const needTileDrainage = ['Very Poorly Drained', 'Poorly Drained', 'Somewhat Poorly Drained'];
const improvedNeedTileDrainage = ['Very Poorly Drained', 'Poorly Drained', 'Somewhat Poorly Drained', 'Moderately Well Drained'];

const SiteConditionForm = ({
  council,
  counties,
  stateList,
  setStep,
}) => {
  const dispatch = useDispatch();
  const {
    state, soilDrainage, tileDrainage, county, plantingDate,
    soilFertility, checkNRCSStandards, acres,
  } = useSelector((s) => s.siteCondition);

  const [soilDrainagePrev, setSoilDrainagePrev] = useState(soilDrainage);
  const [previousSoilDrainage, setPreviousSoilDrainage] = useState('');

  const getTileDrainageYes = (currentDrainage) => {
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
    if (council === 'NECCC' || council === 'SCCC') {
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

  useEffect(() => {
    if (tileDrainage) {
      setPreviousSoilDrainage(soilDrainage);
      const newDrainage = getTileDrainageYes(soilDrainage);
      dispatch(setSoilDrainageRedux(newDrainage));
    } else {
      dispatch(setSoilDrainageRedux(previousSoilDrainage));
    }
  }, [tileDrainage]);

  const handleSoilDrainage = (e) => {
    setSoilDrainagePrev(e.target.value);
    dispatch(setSoilDrainageRedux(e.target.value));
    dispatch(updateTileDrainageRedux(false));
  };

  const handleTileDrainage = () => {
    dispatch(updateTileDrainageRedux(!tileDrainage));
  };

  const updateState = (selectedState) => {
    // Retrieve region
    dispatch(getRegion({ stateId: selectedState.id }));

    // Clear all the rest forms value
    dispatch(setCountyRedux(''));
    dispatch(setCountyIdRedux(''));
    dispatch(setSoilDrainageRedux(''));
    dispatch(updateTileDrainageRedux(false));
    dispatch(setSoilFertilityRedux(''));
    dispatch(checkNRCSRedux(false));

    // TODO: these are temporarily commented, not sure if need to use in the future
    // // Clear out all seeds selected in Redux
    // dispatch(clearSeeds());
    // dispatch(updateDiversityRedux([]));
    // dispatch(clearOptions());

    // Update siteCondition Redux
    const { label } = selectedState;
    dispatch(updateLatlonRedux(statesLatLongDict[label]));
    dispatch(setStateRedux(label, selectedState.id));
    dispatch(setCouncilRedux(selectedState.parents[0].shorthand));
  };

  const handleState = (stateName) => {
    const stateSelected = stateList.filter((s) => s.label === stateName)[0];
    updateState(stateSelected);
  };

  const soilDrainages = () => {
    switch (council) {
      case 'MCCC':
        return soilDrainagesMCCC;
      case 'NECCC':
        return soilDrainagesNECCC;
      case 'SCCC':
        return soilDrainagesNECCC;
      default:
        return soilDrainageValues;
    }
  };

  return (
    <Grid container>

      {/* State */}
      <Grid item xs={0} md={3} />
      <Grid item xs={12} md={6} p="10px">
        <Dropdown
          error={state.length === 0}
          value={state}
          label="State: "
          handleChange={(e) => handleState(e.target.value)}
          size={12}
          items={stateList}
        />
      </Grid>
      <Grid item xs={0} md={3} />

      {/* County / Zone */}
      <Grid item xs={0} md={3} />
      <Grid item xs={12} md={6} p="10px">
        <Dropdown
          error={county.length === 0}
          value={county}
          label={
            council === 'MCCC' ? 'County: ' : 'USDA Plant Hardiness Zone: '
          }
          handleChange={(e) => dispatch(setCountyRedux(e.target.value))}
          size={12}
          items={counties}
        />
      </Grid>
      <Grid item xs={0} md={3} />

      {/* Soil Drainage */}
      <Grid item xs={0} md={3} />
      <Grid item xs={12} md={6} p="10px">
        <Dropdown
          error={soilDrainagePrev.length === 0}
          value={soilDrainagePrev}
          label="Soil Drainage: "
          handleChange={handleSoilDrainage}
          size={12}
          items={soilDrainages()}
        />
      </Grid>
      <Grid item xs={0} md={3} />

      {/* Tile Drainage */}
      <Grid item xs={0} md={3} />
      <Grid item xs={12} md={6} p="10px">
        {(tileDrainage ? improvedNeedTileDrainage.includes(soilDrainage) : needTileDrainage.includes(soilDrainage))
        && (
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
            {(tileDrainage ? improvedNeedTileDrainage.includes(soilDrainage) : needTileDrainage.includes(soilDrainage) || council !== '')
            && (
            <>
              <Typography>Your improved drainage class is: </Typography>
              <Typography fontWeight="bold">{soilDrainage}</Typography>
            </>
            )}

          </Grid>
        </Grid>
        )}
      </Grid>
      <Grid item xs={0} md={3} />

      {/* Planting Date */}
      <Grid item xs={0} md={3} />
      <Grid item xs={12} md={6} p="10px">
        <DatePicker
          label="Planned Planting Date: "
          value={plantingDate}
          handleChange={(e) => {
            const formattedDate = dayjs(e).format('MM/DD/YYYY');
            dispatch(setPlantingDateRedux(formattedDate));
          }}
        />
      </Grid>
      <Grid item xs={0} md={3} />

      {/* Acres */}
      <Grid item xs={0} md={3} />
      <Grid item xs={12} md={6} p="10px">
        <NumberTextField
          errorValue={acres <= 0}
          value={acres}
          label="Acres"
          disabled={false}
          onChange={(value) => {
            dispatch(setAcresRedux(value));
          }}
          placeholder="Enter your field acres here"
        />
      </Grid>
      <Grid item xs={0} md={3} />

      {/* NRCS Standards */}
      <Grid item xs={0} md={3} />
      {council === 'MCCC' && (
        <Grid
          item
          xs={12}
          md={6}
          p="10px"
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
          xs={12}
          md={6}
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
      <Grid item xs={0} md={3} />

      <Grid item xs={12} margin="1rem">
        <Button variant="contained" onClick={() => setStep(1)}>Back</Button>
      </Grid>

    </Grid>
  );
};

export default SiteConditionForm;
