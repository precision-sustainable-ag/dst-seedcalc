import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";
import { RegionSelectorMap } from "@psa/dst.ui.region-selector-map";
import PlaceIcon from "@mui/icons-material/Place";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { availableStates } from "../../../../../../shared/data/dropdown";
import { Dropdown } from "../../../../../../components/Dropdown";
import "./../MapComponent/mapComponent.css";
import DSTImport from "../../../../../../components/DSTImport";
import {
  updateAllSteps,
  updateModal,
} from "../../../../../../features/stepSlice";

const RegionSelector = ({
  setMapState,
  selectedState,
  handleStateDropdown,
  states,
  handleSteps,
  step,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [CSVImport, setCSVImport] = useState(null);

  const data = useSelector((state) => state.steps.value);

  //////////////////////////////////////////////////////////
  //                      Redux                           //
  //////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////
  //                      State Logic                     //
  //////////////////////////////////////////////////////////
  const handleModal = (type, title, description) => {
    var payload = {};
    if (type === "error") {
      payload = {
        value: {
          loading: false,
          error: true,
          success: false,
          errorTitle: title,
          errorMessage: description,
          successTitle: "",
          successMessage: "",
          isOpen: true,
        },
      };
    } else {
      payload = {
        value: {
          loading: false,
          error: true,
          success: true,
          errorTitle: "",
          errorMessage: "",
          successTitle: title,
          successMessage: description,
          isOpen: true,
        },
      };
    }
    dispatch(updateModal(payload));
  };

  return (
    <Grid xs={12} container>
      <Grid item xs={7} md={10} className="site-condition-container">
        <Dropdown
          value={selectedState?.label || ""}
          label={"State: "}
          handleChange={(e) => handleStateDropdown(e.target.value)}
          size={12}
          items={states}
        />
      </Grid>
      <Grid xs={5} md={2} item>
        <Button
          className="mark-location-button"
          disabled={
            Object.keys(selectedState).length !== 0 && step !== 2 ? false : true
          }
          variant={"contained"}
          onClick={() => handleSteps("next", step === 2 ? true : false)}
        >
          Mark Location <PlaceIcon />
        </Button>
      </Grid>
      <Grid xs={12} md={12} item>
        <RegionSelectorMap
          selectorFunction={setMapState}
          selectedState={selectedState.label}
          availableStates={availableStates}
          initWidth="100%"
          initHeight="360px"
          initLon={-78}
          initLat={43}
          initStartZoom={4}
        />
        <DSTImport
          handleModal={handleModal}
          setCSVImport={setCSVImport}
          CSVImport={CSVImport}
          navigate={navigate}
          dispatch={dispatch}
          updateAllSteps={updateAllSteps}
          setOpenModal={setOpenModal}
          openModal={openModal}
        />
      </Grid>
    </Grid>
  );
};

export default RegionSelector;
