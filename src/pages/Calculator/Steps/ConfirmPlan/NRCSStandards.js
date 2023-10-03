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
import "./NRCSStandard.css";
import DSTTable from "../../../../components/DSTTable";
import { useState } from "react";

const NRCSStandards = ({ NRCS }) => {
  const NRCSItem = ({ title, result, data }) => {
    const [expanded, setExpanded] = useState(false);
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
          <Accordion
            expanded={expanded}
            onChange={() => setExpanded(!expanded)}
          >
            <AccordionSummary
              className="nrcs-summary"
              expandIcon={
                <Typography className="nrcs-expanded">
                  {expanded ? "Hide" : "Show"} Details
                </Typography>
              }
              sx={{ height: "24px", minHeight: "24px" }}
            >
              {result ? (
                <CheckIcon sx={{ color: "green" }}></CheckIcon>
              ) : (
                <ClearIcon sx={{ color: "red" }}></ClearIcon>
              )}
              <Typography sx={{ float: "left", marginLeft: "5px" }}>
                {result ? "passed" : "failed"}
              </Typography>
            </AccordionSummary>
            <AccordionDetails className="nrcs-details">
              <Typography>{renderTable(data)}</Typography>
            </AccordionDetails>
          </Accordion>
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
        data={NRCS.results.seedingRate}
      />

      <NRCSItem
        title={"Planting Date"}
        result={NRCS.results.plantingDate.value}
        data={NRCS.results.plantingDate}
      />

      <NRCSItem
        title={"Ratio"}
        result={NRCS.results.ratio.value}
        data={NRCS.results.ratio}
      />

      <NRCSItem
        title={"Soil Drainage"}
        result={NRCS.results.soilDrainage.value}
        data={NRCS.results.soilDrainage}
      />

      <NRCSItem
        title={"Expected Winter Survival"}
        result={NRCS.results.expectedWinterSurvival.value}
        data={NRCS.results.expectedWinterSurvival}
      />
    </>
  );
};

export default NRCSStandards;
