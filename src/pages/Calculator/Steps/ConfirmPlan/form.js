import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Typography, Box, Link, Button, Modal } from "@mui/material";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

import { calculateAllConfirmPlan } from "../../../../shared/utils/calculate";
import { handleDownload } from "../../../../shared/utils/exportExcel";
import { updateSteps } from "../../../../features/stepSlice/index";
import { NumberTextField } from "../../../../components/NumberTextField";
import { DSTTextField } from "../../../../components/DSTTextField";
import { DSTSwitch } from "../../../../components/Switch";
import NRCSDetailModal from "./modal";
import { generateNRCSStandards } from "../../../../shared/utils/NRCS/calculateNRCS";
import ConfirmPlanCharts from "./charts";
import NRCSStandards from "./NRCSStandards";
import "./../steps.css";
import SeedsSelectedList from "../../../../components/SeedsSelectedList";
import { emptyValues } from "../../../../shared/utils/calculate";

const ConfirmPlanForm = ({
  updateSeed,
  NRCS,
  handleModal,
  data,
  speciesSelection,
}) => {
  const theme = useTheme();
  const matchesMd = useMediaQuery(theme.breakpoints.down("md"));
  const matchesUpMd = useMediaQuery(theme.breakpoints.up("md"));
  const renderSeedData = (seed) => {
    return (
      <Grid container xs={12}>
        <Grid item xs={12}>
          <Typography className="confirm-plan-header">{seed.label}</Typography>
        </Grid>
        <Grid item xs={12}>
          {renderConfirmPlanForm(seed)}
        </Grid>
      </Grid>
    );
  };
  const renderStepsForm = (label1, label2, label3) => {
    if (Array.isArray(label2)) {
      return (
        <Grid container xs={12} className="confirm-plan-form-container">
          <Grid item xs={3}>
            <Typography
              className={matchesMd ? "mix-ratio-form-label" : "no-display"}
            >
              {label1}
            </Typography>
          </Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={3}>
            <Typography
              className={matchesMd ? "mix-ratio-form-label" : "no-display"}
            >
              {label2[0]}
            </Typography>
          </Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={3}>
            <Typography
              className={matchesMd ? "mix-ratio-form-label" : "no-display"}
            >
              {label2[1]}
            </Typography>
          </Grid>
          <Grid container xs={12} className="confirm-plan-form-container">
            <Grid item xs={3}>
              {label3}
            </Grid>
          </Grid>
        </Grid>
      );
    } else {
      return (
        <Grid container xs={12} className="confirm-plan-form-container">
          <Grid item xs={3}>
            <Typography
              className={matchesMd ? "mix-ratio-form-label" : "no-display"}
            >
              {label1}
            </Typography>
          </Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={3}>
            <Typography
              className={matchesMd ? "mix-ratio-form-label" : "no-display"}
            >
              {label2}
            </Typography>
          </Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={3}>
            <Typography
              className={matchesMd ? "mix-ratio-form-label" : "no-display"}
            >
              {label3}
            </Typography>
          </Grid>
        </Grid>
      );
    }
  };
  const renderTotalCostOfMix = (data) => {
    const totalCostOfMix = data.speciesSelection.seedsSelected.reduce(
      (sum, a) => sum + a.totalCost,
      0
    );
    return (
      <Grid container xs={12}>
        <Grid item xs={12}>
          <Typography className="confirm-plan-header">
            Total Cost of mix:
          </Typography>
        </Grid>
        <Grid item xs={3} className="confirm-plan-form-container">
          <DSTTextField
            className="text-field-100"
            id="filled-basic"
            label={`${data.speciesSelection.seedsSelected[0].label}`}
            variant="filled"
            disabled={true}
            value={`$${data.speciesSelection.seedsSelected[0].totalCost.toFixed(
              2
            )}`}
          />{" "}
        </Grid>
        <Grid item xs={1} className="confirm-plan-form-container">
          <Typography className="math-icon">+</Typography>
        </Grid>
        {data.speciesSelection.seedsSelected.map((s, i) => {
          if (i !== 0) {
            return (
              <>
                <Grid item xs={3} className="confirm-plan-form-container">
                  <DSTTextField
                    className="text-field-100"
                    id="filled-basic"
                    label={`${s.label}`}
                    variant="filled"
                    disabled={true}
                    value={`$${s.totalCost.toFixed(2)}`}
                  />{" "}
                </Grid>
                <Grid item xs={1} className="confirm-plan-form-container">
                  <Typography className="math-icon">
                    {i !== data.speciesSelection.seedsSelected.length - 1
                      ? "+"
                      : "="}
                  </Typography>
                </Grid>
              </>
            );
          }
        })}
        <Grid item xs={3} className="confirm-plan-form-container">
          <DSTTextField
            className="text-field-100"
            id="filled-basic"
            label={"Total Cost of Mix"}
            variant="filled"
            disabled={true}
            value={`$${totalCostOfMix.toFixed(2)}`}
          />{" "}
        </Grid>
      </Grid>
    );
  };
  const renderConfirmPlanForm = (seed) => {
    return (
      <Grid container xs={12}>
        {renderStepsForm("Bulk Lbs / Acre", "Acres", "Total Pounds")}
        <Grid container xs={12} className="confirm-plan-form-container">
          <Grid item xs={3}>
            <NumberTextField
              className="text-field-100"
              id="filled-basic"
              disabled={true}
              label="Bulk Lbs / Acre"
              variant="filled"
              handleChange={(e) => {
                updateSeed(e.target.value, "bulkSeedingRate", seed);
              }}
              value={seed.bulkSeedingRate}
            />
          </Grid>
          <Grid item xs={1}>
            <Typography className="math-icon">X</Typography>
          </Grid>
          <Grid item xs={3}>
            <NumberTextField
              className="text-field-100"
              id="filled-basic"
              label="Acres"
              variant="filled"
              disabled={false}
              handleChange={(e) => {
                updateSeed(e.target.value, "acres", seed);
              }}
              value={seed.acres}
            />
          </Grid>
          <Grid item xs={1}>
            <Typography className="math-icon">=</Typography>
          </Grid>
          <Grid item xs={3}>
            <NumberTextField
              className="text-field-100"
              id="filled-basic"
              label="Total Pounds"
              disabled={true}
              variant="filled"
              value={seed.totalPounds}
            />
          </Grid>
          <Grid item xs={1}></Grid>
        </Grid>
        <Grid container xs={12} className="steps-row-2">
          <Grid item xs={3}>
            {/* <Typography>Cost / Pound</Typography> */}
          </Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={3}>
            <NumberTextField
              className="text-field-100"
              id="filled-basic"
              label="Cost/Pound"
              variant="filled"
              disabled={true}
              value={seed.costPerPound}
            />
          </Grid>
          <Grid item xs={3}>
            {" "}
            <DSTSwitch
              checked={seed.confirmToggle}
              handleChange={(e) => {
                updateSeed(!seed.confirmToggle, "confirmToggle", seed);
              }}
            />
          </Grid>
        </Grid>

        {renderStepsForm("Cost/Pound", "Total Pounds", "Total Cost")}
        <Grid item xs={3}>
          <NumberTextField
            className="text-field-100"
            id="filled-basic"
            disabled={true}
            label="Cost/Pound"
            variant="filled"
            handleChange={(e) => {
              updateSeed(e.target.value, "costPerPound", seed);
            }}
            value={seed.costPerPound}
          />
        </Grid>
        <Grid item xs={1}>
          <Typography className="math-icon">X</Typography>
        </Grid>
        <Grid item xs={3}>
          <NumberTextField
            className="text-field-100"
            id="filled-basic"
            disabled={true}
            label="Total Pounds"
            variant="filled"
            value={seed.totalPounds}
          />
        </Grid>
        <Grid item xs={1}>
          <Typography className="math-icon">=</Typography>
        </Grid>
        <Grid item xs={3}>
          <DSTTextField
            className="text-field-100"
            id="filled-basic"
            label="Total Cost"
            variant="filled"
            disabled={true}
            value={`$${seed.totalCost.toFixed(2)}`}
          />
        </Grid>
      </Grid>
    );
  };

  return (
    <Grid container xs={12}>
      {/* NRCS Standards */}
      {NRCS.enabled && (
        <NRCSStandards handleModalOpen={handleModal} NRCS={NRCS} />
      )}
      <Grid item xs={12}>
        {" "}
        {speciesSelection.seedsSelected.map((s, i) => {
          return <> {renderSeedData(s)}</>;
        })}
        {renderTotalCostOfMix(data)}
      </Grid>
    </Grid>
  );
};

export default ConfirmPlanForm;