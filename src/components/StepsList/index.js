import { useState } from "react";
import { Fragment } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import { StepButton } from "@mui/material";
import Button from "@mui/material/Button";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { calculatorList } from "../../shared/data/dropdown";

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

export const StepsList = ({ activeStep, setActiveStep, availableSteps }) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  // this completed step is to determine whether each step is completed
  const [completedStep, setCompletedStep] = useState(-1);

  //////////////////////////////////////////////////////////
  //                      State Logic                     //
  //////////////////////////////////////////////////////////

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setCompletedStep(activeStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompletedStep(-1);
  };

  return (
    <Box sx={{ width: "100%", color: "#4f5f30" }}>
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        nonLinear
        className="stepper-container"
      >
        {calculatorList.map((label, index) => {
          return (
            <Step
              key={label}
              sx={{ color: "#4f5f30" }}
              completed={index <= completedStep}
            >
              <StepButton
                className="steps-label"
                onClick={() => setActiveStep(index)}
              >
                {matches && label}
              </StepButton>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === calculatorList.length ? (
        <Fragment>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              <ArrowBackIosIcon />
              BACK
            </Button>
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
              {activeStep !== 0 && <ArrowBackIosIcon />}
              {calculatorList[activeStep - 1]}
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button
              disabled={availableSteps[activeStep] === true ? false : true}
              onClick={handleNext}
            >
              {activeStep === calculatorList.length - 1
                ? "Finish"
                : calculatorList[activeStep + 1]}{" "}
              <ArrowForwardIosIcon />
            </Button>
          </Box>
        </Fragment>
      )}
    </Box>
  );
};
