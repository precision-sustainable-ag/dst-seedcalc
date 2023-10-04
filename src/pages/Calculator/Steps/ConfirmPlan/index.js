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
import NRCSDetailModal from "./modal";
import { generateNRCSStandards } from "./../../../../shared/utils/NRCS/calculateNRCS";
import ConfirmPlanCharts from "./charts";
import "./../steps.css";
import SeedsSelectedList from "../../../../components/SeedsSelectedList";
import { emptyValues } from "../../../../shared/utils/calculate";
import ConfirmPlanForm from "./form";

const ConfirmPlan = ({ council }) => {
  // themes
  const theme = useTheme();
  const matchesMd = useMediaQuery(theme.breakpoints.down("md"));
  const matchesUpMd = useMediaQuery(theme.breakpoints.up("md"));
  // useSelector for crops &  reducer
  const [modalOpen, setModalOpen] = useState(false);
  const [currentModal, setCurrentModal] = useState({ value: false, seeds: [] });
  const dispatch = useDispatch();

  const data = useSelector((state) => state.steps.value);
  const speciesSelection = data.speciesSelection;
  const NRCS = data.NRCS;

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

  const handleModalOpen = (data) => {
    !modalOpen && setCurrentModal(data);
    setModalOpen(!modalOpen);
  };

  const renderSeedsSelected = (seed) => {
    return <SeedsSelectedList list={speciesSelection.seedsSelected} />;
  };

  const generateSeedNull = () => {
    const seed = { ...speciesSelection.seedsSelected[1] };
    console.log("generateSeedNull", emptyValues(seed));
    return emptyValues(seed);
  };

  //////////////////////////////////////////////////////////
  //                     useEffect                        //
  //////////////////////////////////////////////////////////

  useEffect(() => {
    initialDataLoad();
    // FIXME: this line seems not have any funcitonality here, NRCS calculated in ReviewMix
    generateNRCSStandards(speciesSelection.seedsSelected, data.siteCondition);
  }, []);

  //////////////////////////////////////////////////////////
  //                      Render                          //
  //////////////////////////////////////////////////////////

  return (
    <Grid xs={12} container>
      {currentModal !== null && (
        <NRCSDetailModal
          modalOpen={modalOpen}
          handleModalOpen={handleModalOpen}
          data={currentModal}
        />
      )}
      {renderSeedsSelected()}
      <Grid
        xs={12}
        md={speciesSelection.seedsSelected.length > 0 ? 11 : 12}
        item
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12}>
          <Typography variant="h2">Confirm your plan</Typography>

          {/* Export */}

          <Grid container sx={{ marginTop: "5px" }} xs={12}>
            <Grid item xs={matchesUpMd ? 11 : 10}></Grid>
            <Grid item xs={matchesUpMd ? 1 : 2}>
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
          <ConfirmPlanForm
            updateSeed={updateSeed}
            NRCS={NRCS}
            handleModal={handleModalOpen}
            data={data}
            speciesSelection={speciesSelection}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};
export default ConfirmPlan;
