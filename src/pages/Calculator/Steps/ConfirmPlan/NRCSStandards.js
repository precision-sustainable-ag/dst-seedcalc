import Grid from "@mui/material/Grid";
import { Typography, Box, Link, Button, Modal } from "@mui/material";

import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";

import "./../steps.css";

const NRCSStandards = ({ NRCS, handleModalOpen }) => {
  return (
    <>
      <Grid item xs={12}>
        <Typography sx={{ fontWeight: 600, fontSize: "20px", margin: "20px" }}>
          Indiana NRCS Standards
        </Typography>
      </Grid>
      <Grid xs={1}></Grid>
      <Grid xs={10}>
        <Typography sx={{ fontSize: "20px", fontWeight: 600, float: "left" }}>
          Seeding Rate
        </Typography>
      </Grid>
      <Grid xs={1}></Grid>
      <Grid xs={1}></Grid>
      <Grid xs={10}>
        <Box className="NRCS-result-container">
          <Typography sx={{ float: "left" }}>
            {" "}
            {NRCS.results.seedingRate.value ? (
              <CheckIcon sx={{ color: "green" }}></CheckIcon>
            ) : (
              <ClearIcon sx={{ color: "red" }}></ClearIcon>
            )}
          </Typography>
          <Typography sx={{ float: "left", marginLeft: "5px" }}>
            {NRCS.results.seedingRate.value ? "passed" : "failed"}
          </Typography>
          <Link
            sx={{
              float: "right",
              cursor: "pointer",
              marginTop: "2px",
            }}
            onClick={() => {
              handleModalOpen(NRCS.results.seedingRate);
            }}
          >
            Show Details
          </Link>
        </Box>
      </Grid>
      <Grid xs={1}></Grid>
      <Grid xs={1}></Grid>
      <Grid xs={10}>
        <Typography sx={{ fontSize: "20px", fontWeight: 600, float: "left" }}>
          Planting Date
        </Typography>
      </Grid>
      <Grid xs={1}></Grid>

      <Grid xs={1}></Grid>
      <Grid xs={10}>
        <Box className="NRCS-result-container">
          <Typography sx={{ float: "left" }}>
            {" "}
            {NRCS.results.plantingDate.value ? (
              <CheckIcon sx={{ color: "green" }}></CheckIcon>
            ) : (
              <ClearIcon sx={{ color: "red" }}></ClearIcon>
            )}
          </Typography>
          <Typography sx={{ float: "left", marginLeft: "5px" }}>
            {NRCS.results.plantingDate.value ? "passed" : "failed"}
          </Typography>
          <Link
            sx={{
              float: "right",
              cursor: "pointer",
              marginTop: "2px",
            }}
            onClick={() => {
              handleModalOpen(NRCS.results.plantingDate);
            }}
          >
            Show Details
          </Link>
        </Box>
      </Grid>
      <Grid xs={1}></Grid>

      <Grid xs={1}></Grid>
      <Grid xs={10}>
        <Typography sx={{ fontSize: "20px", fontWeight: 600, float: "left" }}>
          Ratio
        </Typography>
      </Grid>
      <Grid xs={1}></Grid>
      <Grid xs={1}></Grid>
      <Grid xs={10}>
        <Box className="NRCS-result-container">
          <Typography sx={{ float: "left" }}>
            {" "}
            {NRCS.results.ratio.value ? (
              <CheckIcon sx={{ color: "green" }}></CheckIcon>
            ) : (
              <ClearIcon sx={{ color: "red" }}></ClearIcon>
            )}
          </Typography>
          <Typography sx={{ float: "left", marginLeft: "10px" }}>
            {NRCS.results.ratio.value ? "passed" : "failed"}
          </Typography>
          <Link
            sx={{
              float: "right",
              cursor: "pointer",
              marginTop: "2px",
            }}
            onClick={() => {
              handleModalOpen(NRCS.results.ratio);
            }}
          >
            Show Details
          </Link>
        </Box>
      </Grid>
      <Grid xs={1}></Grid>

      <Grid xs={1}></Grid>
      <Grid xs={10}>
        <Typography sx={{ fontSize: "20px", fontWeight: 600, float: "left" }}>
          Soil Drainage
        </Typography>
      </Grid>
      <Grid xs={1}></Grid>
      <Grid xs={1}></Grid>
      <Grid xs={10}>
        <Box className="NRCS-result-container">
          <Typography sx={{ float: "left" }}>
            {NRCS.results.soilDrainage.value ? (
              <CheckIcon sx={{ color: "green" }}></CheckIcon>
            ) : (
              <ClearIcon sx={{ color: "red" }}></ClearIcon>
            )}
          </Typography>
          <Typography sx={{ float: "left", marginLeft: "5px" }}>
            {NRCS.results.soilDrainage.value ? "passed" : "failed"}
          </Typography>
          <Link
            sx={{
              float: "right",
              cursor: "pointer",
              marginTop: "2px",
            }}
            onClick={() => {
              handleModalOpen(NRCS.results.soilDrainage);
            }}
          >
            Show Details
          </Link>
        </Box>
      </Grid>
      <Grid xs={1}></Grid>

      <Grid xs={1}></Grid>
      <Grid xs={10}>
        <Typography sx={{ fontSize: "20px", fontWeight: 600, float: "left" }}>
          Expected Winter Survival
        </Typography>
      </Grid>
      <Grid xs={1}></Grid>
      <Grid xs={1}></Grid>
      <Grid xs={10}>
        <Box className="NRCS-result-container">
          <Typography sx={{ float: "left", marginLeft: "5px" }}>
            {NRCS.results.expectedWinterSurvival.value}
          </Typography>
          <Link
            sx={{
              float: "right",
              cursor: "pointer",
              marginTop: "2px",
            }}
            onClick={() => {
              handleModalOpen(NRCS.results.expectedWinterSurvival);
            }}
          >
            Show Details
          </Link>
        </Box>
      </Grid>
      <Grid xs={1}></Grid>
    </>
  );
};
export default NRCSStandards;
