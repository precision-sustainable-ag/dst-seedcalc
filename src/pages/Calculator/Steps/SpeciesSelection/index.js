/* eslint-disable no-shadow */
/// ///////////////////////////////////////////////////////
//                      Imports                         //
/// ///////////////////////////////////////////////////////

import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import { useSelector, useDispatch } from 'react-redux';
import { Typography, Box } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import { Spinner } from '@psa/dst.ui.spinner';
import SearchField from '../../../../components/SearchField';
import { seedsType, seedsLabel } from '../../../../shared/data/species';
import { validateForms } from '../../../../shared/utils/format';
import PlantList from './PlantList';
import Diversity from './diversity';
import { removeOptionRedux, removeSeedRedux, updateDiversityRedux } from '../../../../features/calculatorSlice/actions';
import '../steps.scss';
import { createUserInput, createCalculator } from '../../../../shared/utils/calculator';
import { setAlertStateRedux } from '../../../../features/userSlice/actions';
import { historyStates } from '../../../../features/userSlice/state';

const SpeciesSelection = ({ setSiteConditionStep, completedStep, setCompletedStep }) => {
  // useSelector for crops reducer data
  const dispatch = useDispatch();

  const {
    seedsSelected, loading, crops,
  } = useSelector((state) => state.calculator);
  const {
    soilDrainage, plantingDate, acres, county, council,
  } = useSelector((state) => state.siteCondition);
  const { historyState } = useSelector((state) => state.user);

  const [filteredSeeds, setFilteredSeeds] = useState([]);
  const [query, setQuery] = useState('');

  const [accordionState, setAccordionState] = useState(
    seedsType.reduce((res, type) => {
      res[type] = false;
      return res;
    }, {}),
  );

  /// ///////////////////////////////////////////////////////
  //                    State Logic                       //
  /// ///////////////////////////////////////////////////////

  // Filter query logic
  const updateQuery = (e) => {
    const query = e.target.value;
    setQuery(query);
    if (query !== '') {
      setAccordionState({
        ...seedsType.reduce((res, type) => {
          res[type] = true;
          return res;
        }, {}),
      });
    }
    const filtered = query !== ''
      ? crops.filter((x) => x.label.toLowerCase().includes(query.toLowerCase()))
      : crops;
    setFilteredSeeds(filtered);
  };

  const handleExpandAccordion = (type) => {
    const open = accordionState[type];
    setAccordionState({ ...accordionState, [type]: !open });
  };

  const userInput = createUserInput(soilDrainage, plantingDate, acres);
  // use a region object array for sdk init
  const regions = [{ label: county }];

  /// ///////////////////////////////////////////////////////
  //                    useEffects                         //
  /// ///////////////////////////////////////////////////////

  useEffect(() => {
    setSiteConditionStep(1);
  }, []);

  useEffect(() => {
    setFilteredSeeds(crops);
  }, [crops]);

  // unselect crops with missing fields
  useEffect(() => {
    // TODO:
    // NOTE: the calculator here is only used for validating, the calculator for calculation is initialized in MixRatios
    try {
      // eslint-disable-next-line no-unused-vars
      const seedingRateCalculator = createCalculator(seedsSelected, council, regions, userInput);

      // update diversity selected
      let diversity = [];
      seedsSelected.forEach((seed) => {
        diversity.push(seed.group.label);
      });
      diversity = diversity.filter((group, index) => diversity.indexOf(group) === index);
      dispatch(updateDiversityRedux(diversity));

      // validate next button
      validateForms(
        seedsSelected.length > 0,
        1,
        completedStep,
        setCompletedStep,
      );
    } catch (err) {
      // if the crop is not valid, remove it from seedSelected
      const lastAddedSeedName = seedsSelected[seedsSelected.length - 1]?.label;
      dispatch(removeSeedRedux(lastAddedSeedName));
      dispatch(removeOptionRedux(lastAddedSeedName));
      dispatch(setAlertStateRedux({
        open: true,
        type: 'error',
        message: 'Error: Invalid crop!',
      }));
    }
  }, [seedsSelected]);

  /// ///////////////////////////////////////////////////////
  //                      Render                          //
  /// ///////////////////////////////////////////////////////

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12}>
        <Typography variant="h2">
          Select one or more species for your mix.
        </Typography>
        {historyState === historyStates.imported && (
        <Typography sx={{
          fontWeight: 'bold', margin: '1rem', marginBottom: '0',
        }}
        >
          <span style={{ color: 'red' }}>Warning: </span>
          Making changes on this page will reset the subsequent steps of the calculation.
        </Typography>
        )}
      </Grid>
      <Grid item xs={11}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          p="1rem"
        >

          <SearchField handleChange={updateQuery} value={query} />
          {seedsSelected.length === 0
            ? (
              <Typography
                variant="h2"
                sx={{
                  backgroundColor: 'transparent',
                }}
              >
                Click Show details to see species options, or use the search bar to find a specific species you can pair to create a mix.
              </Typography>
            )
            : <Diversity />}

        </Box>
      </Grid>

      {seedsType.map((seedType, i) => (
        <Grid item xs={12} key={i}>
          <Accordion
            expanded={accordionState[seedType]}
            onChange={() => handleExpandAccordion(seedType)}
          >
            <AccordionSummary
              expandIcon={(
                <Typography sx={{ textDecoration: 'underline' }}>
                  {accordionState[seedType] ? 'Hide ' : 'Show '}
                  Details
                </Typography>
              )}
            >
              <Typography>{seedsLabel[seedType]}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {loading && <Spinner />}
              <PlantList
                seedType={seedType}
                filteredSeeds={filteredSeeds}
              />
            </AccordionDetails>
          </Accordion>
        </Grid>
      ))}
    </Grid>
  );
};
export default SpeciesSelection;
