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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styled from '@emotion/styled';
import { updateSteps } from '../../../../features/stepSlice';
import { seedingMethods } from '../../../../shared/data/dropdown';
import Dropdown from '../../../../components/Dropdown';
import '../steps.scss';
import { setOptionRedux } from '../../../../features/calculatorSlice/actions';

const LeftGrid = styled(Grid)(() => ({
  '&.MuiGrid-item': {
    height: '150px',
    border: '1px solid #c7c7c7',
    borderLeft: 'none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& p': {
      fontWeight: 'bold',
    },
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
      padding: '11px',
      margin: '0 auto',
      backgroundColor: '#E5E7D5',
      border: 'solid 2px',
      borderRadius: '50%',
    },
    '& p': {
      fontWeight: 'bold',
    },
  },
}));

const SeedingMethod = ({ council }) => {
  const [methods, setMethods] = useState({});
  // useSelector for crops reducer data
  const dispatch = useDispatch();
  const data = useSelector((state) => state.steps.value);
  const { seedingMethod, speciesSelection } = data;
  const { selectedSpecies, seedsSelected } = speciesSelection;

  const mixRedux = useSelector((state) => state.calculator.seedsSelected);
  const options = useSelector((state) => state.calculator.options);

  // create an key/value pair for the seed and related accordion expanded state
  const [accordionState, setAccordionState] = useState(
    seedsSelected.reduce((res, seed) => {
      res[seed.label] = false;
      return res;
    }, {}),
  );

  /// ///////////////////////////////////////////////////////
  //                      Redux                           //
  /// ///////////////////////////////////////////////////////

  const handleUpdateSteps = (key, val) => {
    const newData = {
      type: 'seedingMethod',
      key,
      value: val,
    };
    dispatch(updateSteps(newData));
  };

  /// ///////////////////////////////////////////////////////
  //                   State Logic                        //
  /// ///////////////////////////////////////////////////////

  const handleSeedingMethod = (e) => {
    handleUpdateSteps('type', e.target.value);
  };

  const renderRightAccordian = (type, val) => (
    <RightGrid item xs={6}>
      {council === 'NECCC' && type !== 'precision' ? (
        <Typography>Not Recommended</Typography>
      ) : (
        <>
          <Box>
            <Typography>{val}</Typography>
          </Box>
          <Typography>Lbs / Acre</Typography>
        </>
      )}
    </RightGrid>
  );

  // handler for click to open accordion
  const handleExpandAccordion = (label) => {
    const open = accordionState[label];
    setAccordionState({ ...accordionState, [label]: !open });
  };

  useEffect(() => {
    // expand related accordion based on sidebar click
    setAccordionState(
      seedsSelected.reduce((res, seed) => {
        res[seed.label] = seed.label === selectedSpecies;
        return res;
      }, {}),
    );
  }, [selectedSpecies]);

  // initially set all seeding methods
  // TODO: maybe build this into redux instead of local state
  useEffect(() => {
    if (council === 'MCCC') {
      mixRedux.forEach((seed) => {
        const coefficients = seed.attributes.Coefficients;
        const plantingMethods = {
          Drilled: 1,
          Precision: parseFloat(coefficients['Precision Coefficient'].values[0]),
          Broadcast: parseFloat(coefficients['Broadcast Coefficient'].values[0]),
          Aerial: parseFloat(coefficients['Aerial Coefficient'].values[0]),
        };
        setMethods((prev) => ({ ...prev, [seed.label]: plantingMethods }));
        // initial set planting method to drilled
        const prevOption = options[seed.label];
        dispatch(setOptionRedux(
          seed.label,
          { ...prevOption, plantingMethod: 'Drilled', plantingMethodModifier: 1 },
        ));
      });
    }
  }, []);

  // function to handle dropdown and update seed options in redux
  const updateOptions = (method) => {
    if (council === 'MCCC') {
      mixRedux.forEach((seed) => {
        const prevOption = options[seed.label];
        const plantingMethod = method;
        const plantingMethodModifier = methods[seed.label][method];
        dispatch(setOptionRedux(seed.label, { ...prevOption, plantingMethod, plantingMethodModifier }));
      });
    }
  };

  /// ///////////////////////////////////////////////////////
  //                    Render                            //
  /// ///////////////////////////////////////////////////////

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h2">Select Seeding Method</Typography>
      </Grid>
      <Grid item xs={12} padding="15px" className="">
        <Dropdown
          value={seedingMethod.type}
          label="Seeding Method: "
          handleChange={(e) => {
            handleSeedingMethod(e);
            updateOptions(e.target.value);
          }}
          size={12}
          items={seedingMethods}
        />
      </Grid>
      {seedsSelected.map((seed, i) => (
        <Grid item xs={12} key={i}>
          <Accordion
            expanded={accordionState[seed.label]}
            onChange={() => handleExpandAccordion(seed.label)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              className="accordian-summary"
            >
              <Typography>{seed.label}</Typography>
            </AccordionSummary>

            <AccordionDetails className="accordian-details">
              <Grid container>
                <LeftGrid item xs={6}>
                  <Typography>Precision: </Typography>
                </LeftGrid>
                {renderRightAccordian('precision', seed.precision)}
                <LeftGrid item xs={6}>
                  <Typography>Drilled: </Typography>
                </LeftGrid>
                {renderRightAccordian('drilled', 1)}
                <LeftGrid item xs={6}>
                  <Typography>
                    Broadcast(with Light Incorporation):
                    {' '}
                  </Typography>
                </LeftGrid>
                {renderRightAccordian('broadcast', seed.broadcast)}
                <LeftGrid item xs={6}>
                  <Typography>
                    Aerial(or broadcast with no Light Incorporation
                    {' '}
                    <span style={{ color: 'red' }}>Not Recommended</span>
                    ):
                  </Typography>
                </LeftGrid>
                {renderRightAccordian('aerial', seed.aerial)}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
      ))}
    </Grid>
  );
};
export default SeedingMethod;
