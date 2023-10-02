import Grid from "@mui/material/Grid";
import {
  Typography,
  Box,
  Link,
  Button,
  Modal,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";

import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";

import "./../steps.css";
import { ExpandMore } from "@mui/icons-material";
import DSTTable from "../../../../components/DSTTable";

const NRCSStandards = ({ NRCS, handleModalOpen }) => {
  const NRCSItem = ({ title, result, openModal }) => {
    return (
      <>
        <Grid xs={1}></Grid>
        <Grid xs={10}>
          <Typography sx={{ fontSize: "20px", fontWeight: 600, float: "left" }}>
            {title}
          </Typography>
        </Grid>
        <Grid xs={1}></Grid>

        <Grid xs={1}></Grid>
        <Grid xs={10}>
          <Box className="NRCS-result-container">
            <Typography sx={{ float: "left" }}>
              {" "}
              {result ? (
                <CheckIcon sx={{ color: "green" }}></CheckIcon>
              ) : (
                <ClearIcon sx={{ color: "red" }}></ClearIcon>
              )}
            </Typography>
            <Typography sx={{ float: "left", marginLeft: "5px" }}>
              {result ? "passed" : "failed"}
            </Typography>
            <Link
              sx={{
                float: "right",
                cursor: "pointer",
                marginTop: "2px",
              }}
              onClick={openModal}
            >
              Show Details
            </Link>
          </Box>
        </Grid>
        <Grid xs={1}></Grid>
      </>
    );
  };

  const renderTable = (data) => {
    const createData = (label, expect, result, pass) => {
      return { label, expect, result, pass };
    };

    const rows = data.seeds.map((d, i) => {
      return createData(
        d.label,
        d.expect,
        d.result,
        d.pass ? "passed" : "failed"
      );
    });

    const cells = ["label", "expect", "result", "pass"];
    return <DSTTable rows={rows} createData={createData} cells={cells} />;
  };
  return (
    <>
      <Grid item xs={12}>
        <Typography sx={{ fontWeight: 600, fontSize: "20px", margin: "20px" }}>
          Indiana NRCS Standards
        </Typography>
      </Grid>

      <NRCSItem
        title={"Seeding Rate"}
        result={NRCS.results.seedingRate.value}
        openModal={() => handleModalOpen(NRCS.results.seedingRate)}
      />

      <NRCSItem
        title={"Planting Date"}
        result={NRCS.results.plantingDate.value}
        openModal={() => handleModalOpen(NRCS.results.plantingDate)}
      />

      <NRCSItem
        title={"Ratio"}
        result={NRCS.results.ratio.value}
        openModal={() => handleModalOpen(NRCS.results.ratio)}
      />

      <NRCSItem
        title={"Soil Drainage"}
        result={NRCS.results.soilDrainage.value}
        openModal={() => handleModalOpen(NRCS.results.soilDrainage)}
      />

      <NRCSItem
        title={"Expected Winter Survival"}
        result={NRCS.results.expectedWinterSurvival.value}
        openModal={() => handleModalOpen(NRCS.results.expectedWinterSurvival)}
      />

      <Grid xs={1}></Grid>
      <Grid xs={10}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            {NRCS.results.expectedWinterSurvival.value ? (
              <CheckIcon sx={{ color: "green" }}></CheckIcon>
            ) : (
              <ClearIcon sx={{ color: "red" }}></ClearIcon>
            )}
            <Typography sx={{ float: "left", marginLeft: "5px" }}>
              {NRCS.results.expectedWinterSurvival.value ? "passed" : "failed"}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              {renderTable(NRCS.results.expectedWinterSurvival)}
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Grid>
      <Grid xs={1}></Grid>
    </>
  );
};

export default NRCSStandards;
