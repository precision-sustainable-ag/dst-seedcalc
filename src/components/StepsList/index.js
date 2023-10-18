import { Fragment } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import "./stepsList.css";

/*
{
  name: StepsList,
  description: Re-usable Steps List component.
  params: {
    steps: An array of steps as str value
    activeStep: Current active step
    skipped: A set of steps  that are skipped
    handleNext: Function when user clicks "Next"
    handleBack: Function when user clicks "Back"
    handleSkip: Function when user clicks "Skip"
    handleReset: Function when user clicks "Reset"
  }
}
*/

export const StepsList = ({
  steps,
  activeStep,
  skipped,
  handleNext,
  handleBack,
  handleSkip,
  handleReset,
  completedStep,
}) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <Box sx={{ color: "primary.text" }}>
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        className="stepper-container"
      >
        {steps.map((label, index) => {
          return (
            <Step key={label} sx={{ color: "#4f5f30" }}>
              <StepLabel className="steps-label">{matches && label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <Fragment>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 1 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button variant="stepper" onClick={handleReset}>
              Reset
            </Button>
          </Box>
        </Fragment>
      ) : (
        <Fragment>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 1 }}>
            <Button
              variant="stepper"
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              {activeStep !== 0 && <ArrowBackIosNewIcon />}
              {steps[activeStep - 1]}
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            {/* {isStepOptional(activeStep) && (
              <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                Skip
              </Button>
            )} */}

            <Button
              variant="stepper"
              disabled={completedStep[activeStep] === true ? false : true}
              onClick={handleNext}
            >
              {activeStep === steps.length - 1
                ? "Finish"
                : steps[activeStep + 1]}{" "}
              <ArrowForwardIosIcon />
            </Button>
          </Box>
        </Fragment>
      )}
    </Box>
  );
};
