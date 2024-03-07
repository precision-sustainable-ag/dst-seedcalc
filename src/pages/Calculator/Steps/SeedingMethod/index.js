/// ///////////////////////////////////////////////////////
//                    Imports                           //
/// ///////////////////////////////////////////////////////

import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { useSelector, useDispatch } from 'react-redux';
import { Typography, Box } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import styled from '@emotion/styled';
import { seedingMethods, seedingMethodsNECCC } from '../../../../shared/data/dropdown';
import Dropdown from '../../../../components/Dropdown';
import '../steps.scss';
import { setOptionRedux } from '../../../../features/calculatorSlice/actions';

const LeftGrid = styled(Grid)(() => ({
  '&.MuiGrid-item': {
    height: '150px',
    border: '1px solid #c7c7c7',
    borderLeft: 'none',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
}));

const RightGrid = styled(Grid)(() => ({
  '&.MuiGrid-item': {
    height: '150px',
    border: '1px solid #c7c7c7',
    borderRight: 'none',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    '& .MuiBox-root': {
      width: '50px',
      height: '50px',
      margin: '0 auto',
      backgroundColor: '#E5E7D5',
      border: 'solid 2px',
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    '& p': {
      fontWeight: 'bold',
    },
  },
}));

const SeedingMethod = () => {
  const [methods, setMethods] = useState({});
  // useSelector for crops reducer data
  const dispatch = useDispatch();

  const { council } = useSelector((state) => state.siteCondition);
  const { seedsSelected, sideBarSelection, options } = useSelector((state) => state.calculator);

  // create an key/value pair for the seed and related accordion expanded state
  const [accordionState, setAccordionState] = useState(
    seedsSelected.reduce((res, seed) => {
      res[seed.label] = false;
      return res;
    }, {}),
  );

  /// ///////////////////////////////////////////////////////
  //                   State Logic                        //
  /// ///////////////////////////////////////////////////////

  // handler for click to open accordion
  const handleExpandAccordion = (label) => {
    const open = accordionState[label];
    setAccordionState({ ...accordionState, [label]: !open });
  };

  // function to handle dropdown and update seed options in redux
  const updateOptions = (method) => {
    seedsSelected.forEach((seed) => {
      const prevOption = options[seed.label];
      const plantingMethod = method;
      const plantingMethodModifier = methods[seed.label][method];
      dispatch(setOptionRedux(seed.label, { ...prevOption, plantingMethod, plantingMethodModifier }));
    });
  };

  /// ///////////////////////////////////////////////////////
  //                    useEffect                            //
  /// ///////////////////////////////////////////////////////

  // initially set all seeding methods
  // TODO: maybe build this into redux instead of local state
  //       OR init all the data in Species Selection or Mix Ratio page
  useEffect(() => {
    seedsSelected.forEach((seed) => {
      const coefficients = seed.attributes.Coefficients;
      const plantingMethods = council === 'MCCC' ? {
        Drilled: 1,
        Precision: parseFloat(coefficients['Precision Coefficient']?.values[0]) || null,
        Broadcast: parseFloat(coefficients['Broadcast Coefficient']?.values[0]) || null,
        Aerial: parseFloat(coefficients['Aerial Coefficient']?.values[0]) || null,
      } : {
        Drilled: 1,
        'Broadcast(With Cultivation)':
        parseFloat(coefficients['Broadcast with Cultivation Coefficient']?.values[0]) || null,
        'Broadcast(With No Cultivation)':
        parseFloat(coefficients['Broadcast without Cultivation Coefficient']?.values[0]) || null,
        Aerial: parseFloat(coefficients['Aerial Coefficient']?.values[0]) || null,
      };
      setMethods((prev) => ({ ...prev, [seed.label]: plantingMethods }));

      // initial set planting method to drilled
      if (options[seed.label].plantingMethod === null) {
        dispatch(setOptionRedux(
          seed.label,
          { ...options[seed.label], plantingMethod: 'Drilled', plantingMethodModifier: 1 },
        ));
      }
    });
  }, []);

  useEffect(() => {
    // expand related accordion based on sidebar click
    setAccordionState(
      seedsSelected.reduce((res, seed) => {
        res[seed.label] = seed.label === sideBarSelection;
        return res;
      }, {}),
    );
  }, [sideBarSelection]);

  /// ///////////////////////////////////////////////////////
  //                    Render                            //
  /// ///////////////////////////////////////////////////////

  const renderMethod = (type, val, comment) => (
    <>
      <LeftGrid item xs={6}>
        <Box textAlign="left" pl="25%">
          <Typography fontWeight="bold">
            {
            type === 'BroadcastwithCultivation' || type === 'BroadcastwithoutCultivation'
              ? 'Broadcast' : type
            }
          </Typography>
          <Typography fontSize="0.75rem">{comment}</Typography>
        </Box>
      </LeftGrid>
      <RightGrid item xs={6}>
        {!val ? (
          <Typography color="#D84727">Not Recommended</Typography>
        ) : (
          <>
            <Box>
              <Typography sx={{ width: '50px' }}>{val}</Typography>
            </Box>
            <Typography>Lbs per Acre</Typography>
          </>
        )}
      </RightGrid>

    </>
  );

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h2">Select Seeding Method</Typography>
      </Grid>
      <Grid item xs={12} padding="15px" className="">
        <Dropdown
          value={options[seedsSelected[0].label].plantingMethod ?? ''}
          label="Seeding Method: "
          handleChange={(e) => {
            updateOptions(e.target.value);
          }}
          size={12}
          items={council === 'MCCC' ? seedingMethods : seedingMethodsNECCC}
        />
      </Grid>
      {seedsSelected.map((seed, i) => (
        <Grid item xs={12} key={i}>
          <Accordion
            expanded={accordionState[seed.label]}
            onChange={() => handleExpandAccordion(seed.label)}
          >
            <AccordionSummary
              expandIcon={(
                <Typography sx={{ textDecoration: 'underline' }}>
                  {accordionState[seed.label] ? 'Hide ' : 'Show '}
                  Details
                </Typography>
              )}
            >
              <Typography>{seed.label}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container>
                {council === 'MCCC'
                  && (
                  <>
                    {renderMethod('Precision', methods[seed.label]?.Precision)}
                    {renderMethod('Drilled', methods[seed.label]?.Drilled)}
                    {renderMethod(
                      'Broadcast',
                      methods[seed.label]?.Broadcast,
                      'with Light Incorporation',
                    )}
                    {renderMethod(
                      'Aerial',
                      methods[seed.label]?.Aerial,
                      'or broadcast with no Light Incorporation',
                    )}
                  </>
                  )}
                {council === 'NECCC'
                  && (
                  <>
                    {renderMethod('Drilled', methods[seed.label]?.Drilled)}
                    {renderMethod(
                      'BroadcastwithCultivation',
                      methods[seed.label]?.['Broadcast(With Cultivation)'],
                      'with Cultivation, No Packing',
                    )}
                    {renderMethod(
                      'BroadcastwithoutCultivation',
                      methods[seed.label]?.['Broadcast(With No Cultivation)'],
                      'with No Cultivation, No Packing',
                    )}
                    {renderMethod('Aerial', methods[seed.label]?.Aerial)}
                  </>
                  )}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
      ))}
    </Grid>
  );
};
export default SeedingMethod;
