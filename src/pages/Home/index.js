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
import { updateAllSteps, updateSteps } from "../../features/stepSlice";
import { DSTButton } from "./../../components/Button";
import { Header } from "./../../components/Header";
import { CSVModal } from "./CSVModal";
import "./home.css";

const Home = () => {
  const [imgPath, setImgPath] = useState("./neccc-logo.png");
  const [openModal, setOpenModal] = useState(false);
  const [CSVImport, setCSVImport] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.steps.value);
  const speciesSelection = data.speciesSelection;
  const seedsSelected = speciesSelection.seedsSelected;

  // Import logic start
  const handleFileUpload = (event) => {
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const extDataObject = JSON.parse(
          results.data[results.data.length - 1].extData
        );

        setCSVImport(extDataObject);
      },
    });
  };

  const handleImportCSV = () => {
    dispatch(updateAllSteps({ value: CSVImport }));
    navigate("/calculator");
  };
  // Import logic end

  const setModal = () => {
    setOpenModal(!openModal);
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
        <Grid xs={12} className="dst-neccc-logo">
          <img alt="neccc" src={imgPath} />
        </Grid>
        <DSTButton
          text="Start a new calculation"
          buttonClass="dst-button"
          size={12}
          theme="dstTheme"
          path={{ type: "local", url: "/calculator" }}
        />
        {/* <Grid xs={12}>
          <Button className="import-button" onClick={setModal}>
            Import previous calculation
          </Button>
        </Grid> */}
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
      </Grid>
    </Fragment>
  );
};

export default Home;
