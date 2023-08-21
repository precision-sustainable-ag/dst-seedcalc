import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { Modal } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import Papa from "papaparse";
import {
  updateAllSteps,
  updateSteps,
  updateModal,
} from "../../features/stepSlice";
import { DSTButton } from "./../../components/Button";
import { Header } from "./../../components/Header";
import { CSVModal } from "./CSVModal";
import { Dropdown } from "../../components/Dropdown";
import "./home.css";

const Home = () => {
  const [imgPath, setImgPath] = useState("./mccc-logo.png");
  const [openModal, setOpenModal] = useState(false);
  const [CSVImport, setCSVImport] = useState([]);
  const [council, setCouncil] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.steps.value);
  const speciesSelection = data.speciesSelection;
  const seedsSelected = speciesSelection.seedsSelected;
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
  // Import logic start
  const handleFileUpload = (event) => {
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const lastItem = results.data[results.data.length - 1];
        if (lastItem.label !== "EXT-DATA-OBJECT") {
          handleModal(
            "error",
            "Invalid Format",
            "CSV format invalid. Please try again."
          );
        } else {
          const extDataObject = JSON.parse(
            results.data[results.data.length - 1].extData
          );
          console.log("ext data: ", extDataObject);
          setCSVImport(extDataObject);
        }
      },
    });
  };

  const handleImportCSV = () => {
    const type = CSVImport.siteCondition.county.includes("Zone")
      ? "NECCC"
      : "MCCC";
    dispatch(updateAllSteps({ value: CSVImport }));
    navigate(`/${type}/calculator`);
  };
  // Import logic end

  const setModal = () => {
    setOpenModal(!openModal);
  };
  const handleCouncil = (e) => {
    setCouncil(e.target.value);
    const imagePath =
      e.target.value === "MCCC" ? "./mccc-logo.png" : "./neccc-logo.png";
    setImgPath(imagePath);
  };
  return (
    <Fragment>
      <Grid container spacing={2}>
        <Header
          className="header-container"
          headerVariant="dstHeaderHome"
          text="Seeding Rate Calculator"
          size={12}
          style={{ mt: 5 }}
        />
        <Grid item xs={12} padding={15} className="site-condition-container">
          <Dropdown
            value={council}
            label={"Council: "}
            handleChange={handleCouncil}
            size={12}
            items={[
              { label: "NECCC", value: "NECCC" },
              { label: "MCCC", value: "MCCC" },
            ]}
          />
        </Grid>
        {council !== "" && (
          <>
            <Grid xs={12} className="dst-mccc-logo">
              <img alt="neccc" src={imgPath} />
            </Grid>
            <DSTButton
              text="Start a new calculation"
              buttonClass="dst-button"
              size={12}
              theme="dstTheme"
              path={{ type: "local", url: `/${council}/calculator` }}
            />
            <DSTButton
              text="Import previous calculation"
              buttonClass="dst-import-button"
              size={12}
              theme="dstTheme"
              handleClick={setModal}
            />
            <CSVModal
              openModal={openModal}
              setModal={setModal}
              handleFileUpload={handleFileUpload}
              handleImportCSV={handleImportCSV}
            />
          </>
        )}
      </Grid>
    </Fragment>
  );
};

export default Home;
