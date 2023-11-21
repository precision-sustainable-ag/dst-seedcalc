/// ///////////////////////////////////////////////////////
//                      Imports                         //
/// ///////////////////////////////////////////////////////

import React, { useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Typography, Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';

import { calculateAllConfirmPlan, emptyValues } from '../../../../shared/utils/calculate';
import { handleDownload } from '../../../../shared/utils/exportExcel';
import { updateSteps } from '../../../../features/stepSlice/index';
import { generateNRCSStandards } from '../../../../shared/utils/NRCS/calculateNRCS';
import ConfirmPlanCharts from './charts';
import '../steps.scss';
import ConfirmPlanForm from './form';

const ConfirmPlan = ({ council }) => {
  // themes
  const theme = useTheme();
  const matchesMd = useMediaQuery(theme.breakpoints.down('md'));
  const matchesUpMd = useMediaQuery(theme.breakpoints.up('md'));
  // useSelector for crops &  reducer
  const dispatch = useDispatch();

  const data = useSelector((state) => state.steps.value);
  const { speciesSelection } = data;

  /// ///////////////////////////////////////////////////////
  //                      Redux                           //
  /// ///////////////////////////////////////////////////////
  const handleUpdateSteps = (key, val) => {
    const newData = {
      type: 'speciesSelection',
      key,
      value: val,
    };
    dispatch(updateSteps(newData));
  };

  const handleUpdateAllSteps = (prevData, index) => {
    const newData = [...prevData];
    newData[index] = calculateAllConfirmPlan(newData[index]);
    handleUpdateSteps('seedsSelected', newData);
  };

  const initialDataLoad = () => {
    const newData = [...JSON.parse(JSON.stringify(speciesSelection.seedsSelected))];
    speciesSelection.seedsSelected.map((s, i) => {
      newData[i] = calculateAllConfirmPlan(s);
      handleUpdateAllSteps(newData, i);
      return null;
    });
  };

  const updateSeed = (val, key, seed) => {
    // find index of seed, parse a copy, update proper values, & send to Redux
    const index = speciesSelection.seedsSelected.findIndex(
      (s) => s.id === seed.id,
    );
    // eslint-disable-next-line no-shadow
    const data = JSON.parse(JSON.stringify(speciesSelection.seedsSelected));
    data[index][key] = val;
    handleUpdateSteps('seedsSelected', data);
    const newData = [...data];
    newData[index] = calculateAllConfirmPlan(data[index]);
    handleUpdateAllSteps(newData, index);
  };

  /// ///////////////////////////////////////////////////////
  //                   State Logic                        //
  /// ///////////////////////////////////////////////////////

  const generateSeedNull = () => {
    const seed = { ...speciesSelection.seedsSelected[1] };
    return emptyValues(seed);
  };

  /// ///////////////////////////////////////////////////////
  //                     useEffect                        //
  /// ///////////////////////////////////////////////////////

  // FIXME: this useEffect seems didn't update anything in redux devtools
  useEffect(() => {
    initialDataLoad();
    generateNRCSStandards(speciesSelection.seedsSelected, data.siteCondition);
  }, []);

  /// ///////////////////////////////////////////////////////
  //                      Render                          //
  /// ///////////////////////////////////////////////////////

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h2">Confirm your plan</Typography>

        {/* Export */}
        <Grid container sx={{ marginTop: '5px' }}>
          <Grid item xs={matchesUpMd ? 11 : 9} />
          <Grid item xs={matchesUpMd ? 1 : 3}>
            <Button
              sx={{
                bgcolor: '#e7885f',
                color: 'white',
                padding: '7px',
                width: '83px',
                margin: '3px',
                fontSize: '12px',
                borderRadius: '26px',
              }}
              onClick={() => {
                handleDownload(
                  [
                    ...speciesSelection.seedsSelected,
                    {
                      ...generateSeedNull(),
                      label: 'EXT-DATA-OBJECT',
                      extData: JSON.stringify(data),
                    },
                  ],
                  council,
                );
              }}
            >
              Export
            </Button>
          </Grid>
        </Grid>

        {/* Charts */}

        <ConfirmPlanCharts
          council={council}
          speciesSelection={speciesSelection}
          matchesMd={matchesMd}
        />

        <ConfirmPlanForm updateSeed={updateSeed} data={data} />
      </Grid>
    </Grid>
  );
};
export default ConfirmPlan;
