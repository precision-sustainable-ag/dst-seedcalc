/// ///////////////////////////////////////////////////////
//                      Imports                         //
/// ///////////////////////////////////////////////////////

import React from 'react';
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
  checkNRCSRedux, setAcresRedux, setCountyRedux, setCountyIdRedux, setPlantingDateRedux,
  setSoilDrainageRedux, setSoilFertilityRedux, updateTileDrainageRedux,
} from '../../../../features/siteConditionSlice/actions';
import '../steps.scss';
import { historyStates } from '../../../../features/userSlice/state';
import { setHistoryDialogStateRedux, setMaxAvailableStepRedux } from '../../../../features/userSlice/actions';
import pirschAnalytics from '../../../../shared/utils/analytics';

const needTileDrainage = ['Very Poorly Drained', 'Poorly Drained', 'Somewhat Poorly Drained'];

const improvedNeedTileDrainage = ['Very Poorly Drained', 'Poorly Drained', 'Somewhat Poorly Drained', 'Moderately Well Drained'];

const getSoilDrainages = (council) => {
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

const getTileDrainage = (currentDrainage, council) => {
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

const SiteConditionForm = ({
  stateList,
  setStep,
  regions,
  setRegions,
  getRegions,
  updateStateRedux,
}) => {
  const dispatch = useDispatch();
  const {
    state, soilDrainage, prevSoilDrainage, tileDrainage, county, plantingDate,
    soilFertility, checkNRCSStandards, acres, council,
  } = useSelector((s) => s.siteCondition);
  // eslint-disable-next-line no-shadow
  const { historyState, maxAvailableStep } = useSelector((state) => state.user);

  const handleState = async (e) => {
    if (historyState === historyStates.imported) {
      dispatch(setHistoryDialogStateRedux({ open: true, type: 'update' }));
      return;
    }
    const stateSelected = stateList.filter((s) => s.label === e.target.value);
    if (stateSelected.length > 0) {
      if (maxAvailableStep > -1) dispatch(setMaxAvailableStepRedux(-1));
      // get new regions for the selected state
      const res = await getRegions(stateSelected[0]);
      setRegions(res);
      updateStateRedux(stateSelected[0]);
    }
  };

  const handleRegion = (e) => {
    if (historyState === historyStates.imported) {
      dispatch(setHistoryDialogStateRedux({ open: true, type: 'update' }));
      return;
    }
    if (maxAvailableStep > -1) dispatch(setMaxAvailableStepRedux(-1));
    dispatch(setCountyRedux(e.target.value));
    const countyId = regions.filter(
      (c) => c.label === e.target.value,
    )[0].id;
    dispatch(setCountyIdRedux(countyId));
    pirschAnalytics('Site Condition', {
      meta: { region: 'update region' },
    });
  };

  const handleSoilDrainage = (e) => {
    if (historyState === historyStates.imported) {
      dispatch(setHistoryDialogStateRedux({ open: true, type: 'update' }));
      return;
    }
    if (maxAvailableStep > -1) dispatch(setMaxAvailableStepRedux(-1));
    dispatch(setSoilDrainageRedux(e.target.value));
    dispatch(updateTileDrainageRedux('', false));
    pirschAnalytics('Site Condition', {
      meta: { 'soil drainage': 'update soil drainage' },
    });
  };

  const handleTileDrainage = () => {
    if (historyState === historyStates.imported) {
      dispatch(setHistoryDialogStateRedux({ open: true, type: 'update' }));
      return;
    }
    if (maxAvailableStep > -1) dispatch(setMaxAvailableStepRedux(-1));
    if (!tileDrainage) {
      // switch tileDrainage to true
      const newDrainage = getTileDrainage(soilDrainage, council);
      dispatch(setSoilDrainageRedux(newDrainage));
      dispatch(updateTileDrainageRedux(soilDrainage, true));
      pirschAnalytics('Site Condition', {
        meta: { 'tile drainage': 'tile drainage' },
      });
    } else {
      // switch to false
      dispatch(setSoilDrainageRedux(prevSoilDrainage));
      dispatch(updateTileDrainageRedux('', false));
    }
  };

  return (
    <Grid container>

      {/* State */}
      <Grid item xs={0} md={3} />
      <Grid item xs={12} md={6} p="10px">
        <Dropdown
          emptyWarning={state.length === 0}
          value={state}
          label="State: "
          handleChange={handleState}
          size={12}
          items={stateList}
          testId="site_condition_state"
        />
      </Grid>
      <Grid item xs={0} md={3} />

      {/* County / Zone */}
      <Grid item xs={0} md={3} />
      <Grid item xs={12} md={6} p="10px">
        <Dropdown
          emptyWarning={county.length === 0}
          value={county}
          label={
            council === 'MCCC' ? 'County: ' : 'USDA Plant Hardiness Zone: '
          }
          handleChange={handleRegion}
          size={12}
          items={regions}
          testId="site_condition_region"
        />
      </Grid>
      <Grid item xs={0} md={3} />

      {/* Soil Drainage */}
      <Grid item xs={0} md={3} />
      <Grid item xs={12} md={6} p="10px">
        <Dropdown
          emptyWarning={soilDrainage === ''}
          value={tileDrainage ? prevSoilDrainage : soilDrainage}
          label="Soil Drainage: "
          handleChange={handleSoilDrainage}
          size={12}
          items={getSoilDrainages(council)}
          testId="site_condition_soil_drainage"
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
                  testId="site_condition_tile_drainage"
                />
                <Typography display="inline">
                  Yes
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={8}>
            {(tileDrainage)
            && (
            <>
              <Typography>Your improved drainage class is: </Typography>
              <Typography fontWeight="bold" data-test="tile_drainage_class">{soilDrainage}</Typography>
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
          emptyWarning={acres <= 0}
          value={acres}
          label="Acres"
          disabled={false}
          onChange={(value) => {
            dispatch(setAcresRedux(value));
          }}
          placeholder="Enter your field acres here"
          testId="site_condition_acres"
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
            emptyWarning={soilFertility === ''}
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
