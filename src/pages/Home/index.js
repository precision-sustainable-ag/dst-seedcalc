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
  const updateImportCSV = (data) => {
    setCSVImport(data);
  };
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
  // const handleFileUpload = (event) => {
  //   event.preventDefault();
  //   const file = event.target.files[0];
  //   const reader = new FileReader();
  //   reader.onload = handleFileRead;
  //   reader.onloadend = console.log("load ENd", reader.result);

  //   reader.readAsText(file);
  // };

  // const handleFileRead = (event) => {
  //   const csv = event.target.result;
  //   //split
  //   console.log("EVENT TARGET RESULT", csv);
  //   const lines = csv.split("\n", 45);
  //   const headers = lines[0].split(",");
  //   const result = [];
  //   console.log("lines", lines);
  //   for (let i = 1; i < lines.length; i++) {
  //     const obj = {};
  //     const currentline = lines[i].split(",");
  //     for (let j = 0; j < headers.length; j++) {
  //       console.log("headers", headers, j);
  //       obj[headers[j]] = currentline[j];
  //     }
  //     result.push(obj);
  //   }
  //   const json = JSON.stringify(result);
  //   console.log("RESULT:    ", result);
  //   setCSVImport(result);
  // };

  const handleUpdateSteps = (key, val) => {
    const data = {
      type: "speciesSelection",
      key: key,
      value: val,
    };
    dispatch(updateSteps(data));
  };
  const updateSeedsSelected = (seeds) => {
    const diversityList = [];
    // run through CSV list, & update Redux's diversitySelected
    handleUpdateSteps("seedsSelected", [...seedsSelected, seeds]);
    seeds.map((s, i) => {
      if (diversityList.length === 0) {
        diversityList.push(s.diversity);
      } else {
        if (!diversityList.includes(s.diveristy)) {
          diversityList.push(s.diversity);
        }
      }
    });
    handleUpdateSteps("diversitySelected", diversityList);
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
