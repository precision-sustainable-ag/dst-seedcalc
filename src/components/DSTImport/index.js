import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";

import { Box } from "@mui/system";
import { Grid, Modal, Typography, Button } from "@mui/material";

import { useDispatch } from "react-redux";
import { updateAllSteps, updateModal } from "../../features/stepSlice";

const modalStyle = {
  position: "absolute",
  top: " 50%",
  left: " 50%",
  transform: " translate(-50%, -50%)",
  width: " 400px",
  backgroundColor: " #fff",
  border: " 2px solid #000",
  boxShadow:
    " 0px 11px 15px -7px rgb(0 0 0 / 20%), 0px 24px 38px 3px rgb(0 0 0 / 14%), 0px 9px 46px 8px rgb(0 0 0 / 12%)",
  padding: " 32px",
};

const DSTImport = ({ setIsImported }) => {
  const [openModal, setOpenModal] = useState(false);
  const [CSVImport, setCSVImport] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  //////////////////////////////////////////////////////////
  //                  Import Logic                        //
  //////////////////////////////////////////////////////////

  // show a modal to handle failure import
  const handleModal = (type, title, description) => {
    const payload = {
      value: {
        loading: false,
        error: true,
        success: type === "error" ? false : true,
        errorTitle: title,
        errorMessage: description,
        successTitle: title,
        successMessage: description,
        isOpen: true,
      },
    };
    dispatch(updateModal(payload));
  };

  const handleFileUpload = (event) => {
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const lastItem = results.data[results.data.length - 1];
        // TODO: not sure how to test error import
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
          setIsImported(true);
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
        <Box sx={modalStyle}>
          <Grid container>
            <Grid xs={3} item></Grid>
            <Grid xs={6} item>
              <Typography variant="h6" component="h2">
                Import a CSV file
              </Typography>
            </Grid>
            <Grid xs={3} item></Grid>
            <Grid xs={2} item></Grid>
            <Grid xs={8} item>
              <Typography sx={{ mt: 2 }}>
                <input type="file" accept=".csv" onChange={handleFileUpload} />
              </Typography>
            </Grid>
            <Grid xs={2} item></Grid>
            <Grid xs={8} item></Grid>
            <Grid xs={4} item>
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
      <Button
        variant="contained"
        onClick={setModal}
        sx={{ textDecoration: "none", margin: "1rem" }}
      >
        Import previous calculation
      </Button>
    </>
  );
};

export default DSTImport;
