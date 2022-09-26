import { Fragment } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
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
}) => {
  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  return (
    <Box sx={{ width: "100%", color: "#4f5f30" }}>
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        className="stepper-container"
      >
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} sx={{ color: "#4f5f30" }} {...stepProps}>
              <StepLabel className="steps-label" {...labelProps}>
                {label}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <Fragment>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </Fragment>
      ) : (
        <Fragment>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              {activeStep === 0 ? "Start" : steps[activeStep - 1]}
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            {isStepOptional(activeStep) && (
              <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                Skip
              </Button>
            )}

            <Button onClick={handleNext}>
              {activeStep === steps.length - 1
                ? "Finish"
                : steps[activeStep + 1]}
            </Button>
          </Box>
        </Fragment>
      )}
    </Box>
  );
};
