//////////////////////////////////////////////////////////
//                      Imports                         //
//////////////////////////////////////////////////////////

import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Typography, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { calculateAllConfirmPlan } from "../../../../shared/utils/calculate";
import { handleDownload } from "./../../../../shared/utils/exportExcel";
import { updateSteps } from "../../../../features/stepSlice/index";
import { generateNRCSStandards } from "./../../../../shared/utils/NRCS/calculateNRCS";
import ConfirmPlanCharts from "./charts";
import "./../steps.scss";
import SeedsSelectedList from "../../../../components/SeedsSelectedList";
import { emptyValues } from "../../../../shared/utils/calculate";
import ConfirmPlanForm from "./form";

const ConfirmPlan = ({ council }) => {
  // themes
  const theme = useTheme();
  const matchesMd = useMediaQuery(theme.breakpoints.down("md"));
  const matchesUpMd = useMediaQuery(theme.breakpoints.up("md"));
  // useSelector for crops &  reducer
  const dispatch = useDispatch();

  const data = useSelector((state) => state.steps.value);
  const speciesSelection = data.speciesSelection;

  //////////////////////////////////////////////////////////
  //                      Redux                           //
  //////////////////////////////////////////////////////////
  const handleUpdateSteps = (key, val) => {
    const data = {
      type: "speciesSelection",
      key: key,
      value: val,
    };
    dispatch(updateSteps(data));
  };

  const handleUpdateAllSteps = (prevData, index) => {
    let data = [...prevData];
    data[index] = calculateAllConfirmPlan(data[index]);
    handleUpdateSteps("seedsSelected", data);
  };

  const initialDataLoad = () => {
    let data = JSON.parse(JSON.stringify(speciesSelection.seedsSelected));
    let newData = [...data];
    speciesSelection.seedsSelected.map((s, i) => {
      newData[i] = calculateAllConfirmPlan(s);
      handleUpdateAllSteps(newData, i);
    });
  };

  const updateSeed = (val, key, seed) => {
    // find index of seed, parse a copy, update proper values, & send to Redux
    const index = speciesSelection.seedsSelected.findIndex(
      (s) => s.id === seed.id
    );
    let data = JSON.parse(JSON.stringify(speciesSelection.seedsSelected));
    data[index][key] = val;
    handleUpdateSteps("seedsSelected", data);
    let newData = [...data];
    newData[index] = calculateAllConfirmPlan(data[index]);
    handleUpdateAllSteps(newData, index);
  };

  //////////////////////////////////////////////////////////
  //                   State Logic                        //
  //////////////////////////////////////////////////////////

  const generateSeedNull = () => {
    const seed = { ...speciesSelection.seedsSelected[1] };
    return emptyValues(seed);
  };

  //////////////////////////////////////////////////////////
  //                     useEffect                        //
  //////////////////////////////////////////////////////////

  // FIXME: this useEffect seems didn't update anything in redux devtools
  useEffect(() => {
    initialDataLoad();
    generateNRCSStandards(speciesSelection.seedsSelected, data.siteCondition);
  }, []);

  //////////////////////////////////////////////////////////
  //                      Render                          //
  //////////////////////////////////////////////////////////

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h2">Confirm your plan</Typography>

        {/* Export */}
        <Grid container sx={{ marginTop: "5px" }} xs={12}>
          <Grid item xs={matchesUpMd ? 11 : 9}></Grid>
          <Grid item xs={matchesUpMd ? 1 : 3}>
            <Button
              className="export-button"
              onClick={() => {
                handleDownload(
                  [
                    ...speciesSelection.seedsSelected,
                    {
                      ...generateSeedNull(),
                      label: "EXT-DATA-OBJECT",
                      extData: JSON.stringify(data),
                    },
                  ],
                  council
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
