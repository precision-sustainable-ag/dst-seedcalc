/// ///////////////////////////////////////////////////////
//                      Imports                         //
/// ///////////////////////////////////////////////////////

import React, { useState } from 'react';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import DatePicker from '../../../../components/DatePicker';
import Dropdown from '../../../../components/Dropdown';
import NumberTextField from '../../../../components/NumberTextField';
import DSTSwitch from '../../../../components/Switch';
import { soilDrainage } from '../../../../shared/data/dropdown';
import { getCrops } from '../../../../features/stepSlice/api';
import '../steps.scss';
import {
  setAcresRedux, setCountyRedux, setPlantingDateRedux, setSoilDrainageRedux,
} from '../../../../features/siteConditionSlice/actions';

const SiteConditionForm = ({
  siteCondition,
  handleUpdateSteps,
  council,
  counties,
  NRCS,
}) => {
  const [checked, setChecked] = useState(NRCS.enabled);
  const dispatch = useDispatch();

  const handleSwitch = () => {
    setChecked(!checked);
    handleUpdateSteps('enabled', 'NRCS', !checked);
  };

  const handleRegion = (region) => {
    const countyId = counties.filter((c) => c.label === region)[0].id;
    handleUpdateSteps('county', 'siteCondition', region);
    // TODO: new site redux here
    dispatch(setCountyRedux(region));
    if (countyId !== undefined && countyId !== undefined) {
      dispatch(
        getCrops({
          regionId: countyId,
        }),
      );
    }
  };

  return (
    <>
      <Grid item xs={12} md={6} p="10px">
        <Dropdown
          value={siteCondition.county}
          label={
            council === 'MCCC' ? 'County: ' : 'USDA Plant Hardiness Zone: '
          }
          handleChange={(e) => handleRegion(e.target.value)}
          size={12}
          items={counties}
        />
      </Grid>

      <Grid item xs={12} md={6} p="10px">
        <Dropdown
          value={siteCondition.soilDrainage}
          label="Soil Drainage: "
          handleChange={(e) => {
            handleUpdateSteps('soilDrainage', 'siteCondition', e.target.value);
            // TODO: new site redux here
            dispatch(setSoilDrainageRedux(e.target.value));
          }}
          size={12}
          items={soilDrainage}
        />
      </Grid>

      <Grid item xs={12} md={6} p="10px">
        <DatePicker
          label="Planned Planting Date: "
          value={siteCondition.plannedPlantingDate}
          handleChange={(e) => {
            const formattedDate = dayjs(e).format('MM/DD/YYYY');
            handleUpdateSteps(
              'plannedPlantingDate',
              'siteCondition',
              formattedDate,
            );
            // TODO: new site redux here
            dispatch(setPlantingDateRedux(formattedDate));
          }}
        />
      </Grid>

      <Grid item xs={12} md={6} p="10px">
        <NumberTextField
          value={siteCondition.acres}
          label="Acres"
          disabled={false}
          handleChange={(e) => {
            handleUpdateSteps('acres', 'siteCondition', e.target.value);
            // TODO: new site redux here
            dispatch(setAcresRedux(parseInt(e.target.value, 10)));
          }}
          placeholder="Enter your field acres here"
        />
      </Grid>

      {council === 'MCCC' && (
        <Grid
          item
          xs={12}
          p="1rem"
          display="flex"
          justifyContent="center"
        >
          <Typography fontSize="1.25rem">Check NRCS Standards: </Typography>
          <DSTSwitch checked={checked} handleChange={handleSwitch} />
        </Grid>
      )}
    </>
  );
};

export default SiteConditionForm;
