/// ///////////////////////////////////////////////////////
//                      Imports                         //
/// ///////////////////////////////////////////////////////

import React, { useState } from 'react';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import DatePicker from '../../../../components/DatePicker';
import Dropdown from '../../../../components/Dropdown';
import NumberTextField from '../../../../components/NumberTextField';
import DSTSwitch from '../../../../components/Switch';
import { soilDrainage, soilFertility } from '../../../../shared/data/dropdown';
import { getCrops } from '../../../../features/stepSlice/api';
import '../steps.scss';
import {
  checkNRCSRedux,
  setAcresRedux, setCountyRedux, setPlantingDateRedux, setSoilDrainageRedux, setSoilFertilityRedux,
} from '../../../../features/siteConditionSlice/actions';

const SiteConditionForm = ({
  council,
  counties,
}) => {
  const [checked, setChecked] = useState(false);
  const dispatch = useDispatch();
  const newSiteCondition = useSelector((state) => state.siteCondition);

  const handleSwitch = () => {
    setChecked(!checked);
    dispatch(checkNRCSRedux(!checked));
  };

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

  return (
    <>
      <Grid item xs={12} md={6} p="10px">
        <Dropdown
          value={newSiteCondition.county}
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
          value={newSiteCondition.soilDrainage}
          label="Soil Drainage: "
          handleChange={(e) => {
            dispatch(setSoilDrainageRedux(e.target.value));
          }}
          size={12}
          items={soilDrainage}
        />
      </Grid>

      <Grid item xs={12} md={6} p="10px">
        <DatePicker
          label="Planned Planting Date: "
          value={newSiteCondition.plannedPlantingDate}
          handleChange={(e) => {
            const formattedDate = dayjs(e).format('MM/DD/YYYY');
            dispatch(setPlantingDateRedux(formattedDate));
          }}
        />
      </Grid>

      <Grid item xs={12} md={6} p="10px">
        <NumberTextField
          value={newSiteCondition.acres}
          label="Acres"
          disabled={false}
          handleChange={(e) => {
            dispatch(setAcresRedux(parseFloat(e.target.value)));
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

      {council === 'NECCC' && (
        <Grid
          item
          xs={12}
          md={6}
          p="10px"
        >
          <Dropdown
            value={newSiteCondition.soilFertility}
            label="Soil Fertility: "
            handleChange={(e) => {
              dispatch(setSoilFertilityRedux(e.target.value));
            }}
            size={12}
            items={soilFertility}
          />
        </Grid>
      )}
    </>
  );
};

export default SiteConditionForm;
