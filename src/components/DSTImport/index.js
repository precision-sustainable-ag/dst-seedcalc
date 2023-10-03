import { useState } from "react";
import Papa from "papaparse";

import { DSTButton } from "../Button";
import { Box } from "@mui/system";
import { Grid, Modal, Typography, Button } from "@mui/material";

import "./DSTImport.css";

const DSTImport = ({
  handleModal,
  setCSVImport,
  CSVImport,
  navigate,
  dispatch,
  updateAllSteps,
  setOpenModal,
  openModal,
}) => {
  //////////////////////////////////////////////////////////
  //                  Import Logic                        //
  //////////////////////////////////////////////////////////

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
          setCSVImport(extDataObject);
        }
      },
    });
  };
  const handleImportCSV = () => {
    if (CSVImport === null) {
      setModal();
      return;
    }
    dispatch(updateAllSteps({ value: CSVImport }));
    navigate(`/calculator`);
    setModal();
  };
  const setModal = () => {
    setOpenModal(!openModal);
  };
  return (
    <>
      <Modal
        open={openModal}
        onClose={setModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="home-import-modal">
          <Grid xs={12} container>
            <Grid xs={3} item></Grid>
            <Grid xs={6} item>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Import a CSV file
              </Typography>
            </Grid>
            <Grid xs={3} item></Grid>
            <Grid xs={2} item></Grid>
            <Grid xs={8} item>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <input type="file" accept=".csv" onChange={handleFileUpload} />
              </Typography>
            </Grid>
            <Grid xs={2} item></Grid>
            <Grid xs={8} item></Grid>
            <Grid xs={4}>
              <Button
                sx={{ marginTop: "15px" }}
                onClick={(e) => {
                  handleImportCSV(e);
                }}
              >
                Import CSV
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
      <DSTButton
        text="Import previous calculation"
        buttonClass="dst-import-button"
        size={12}
        theme="dstTheme"
        handleClick={setModal}
      />
    </>
  );
};

export default DSTImport;
