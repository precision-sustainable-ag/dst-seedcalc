//////////////////////////////////////////////////////////
//                      Imports                         //
//////////////////////////////////////////////////////////

import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { useSelector } from "react-redux";

import {
  SiteCondition,
  SpeciesSelection,
  MixRatio,
  MixSeedingRate,
  SeedTagInfo,
  ReviewMix,
  ConfirmPlan,
  SeedingMethod,
  CompletedPage,
} from "./Steps";

import { calculatorList, completedList } from "../../shared/data/dropdown";
import { Header } from "../../components/Header";
import { StepsList } from "../../components/StepsList";
import "./calculator.css";
import "./../Home/home.css";
import { Alert, Fade, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const Calculator = () => {
  const data = useSelector((state) => state.steps.value);
  const error = useSelector((state) => state.steps.error);
  const type = data.siteCondition.council;
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [completedStep, setCompletedStep] = useState([...completedList]);
  const [showAlert, setShowAlert] = useState(false);

  //////////////////////////////////////////////////////////
  //                      State Logic                     //
  //////////////////////////////////////////////////////////

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  //////////////////////////////////////////////////////////
  //                      Render                          //
  //////////////////////////////////////////////////////////

  const renderCalculator = (step) => {
    switch (step) {
      case "Site Conditions":
        return (
          <SiteCondition
            council={type}
            completedStep={completedStep}
            setCompletedStep={setCompletedStep}
          />
        );
      case "Species Selection":
        return (
          <SpeciesSelection
            council={type}
            completedStep={completedStep}
            setCompletedStep={setCompletedStep}
          />
        );
      case "Mix Ratios":
        return (
          <MixRatio
            council={type}
            completedStep={completedStep}
            setCompletedStep={setCompletedStep}
          />
        );
      case "Mix Seeding Rate":
        return (
          <MixSeedingRate
            council={type}
            completedStep={completedStep}
            setCompletedStep={setCompletedStep}
          />
        );
      case "Seeding Method":
        return (
          <SeedingMethod
            council={type}
            completedStep={completedStep}
            setCompletedStep={setCompletedStep}
          />
        );
      case "Seed Tag Info":
        return (
          <SeedTagInfo
            council={type}
            completedStep={completedStep}
            setCompletedStep={setCompletedStep}
          />
        );
      case "Review Mix":
        return (
          <ReviewMix
            council={type}
            completedStep={completedStep}
            setCompletedStep={setCompletedStep}
          />
        );
      case "Confirm Plan":
        return (
          <ConfirmPlan
            council={type}
            completedStep={completedStep}
            setCompletedStep={setCompletedStep}
          />
        );
      case "Finish":
        return (
          <CompletedPage
            council={type}
            completedStep={completedStep}
            setCompletedStep={setCompletedStep}
          />
        );
      default:
        return;
    }
  };

  useEffect(() => {
    setShowAlert(error);
  }, [error]);

  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item style={{ position: "fixed", top: "0px", zIndex: 1000 }}>
        <Fade in={showAlert}>
          <Alert
            severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => setShowAlert(false)}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            <Typography fontWeight={600}>
              Network Error - Try again later or refresh the page!
            </Typography>
          </Alert>
        </Fade>
      </Grid>
      {data.siteCondition.council === "" ? (
        <Grid xs={12} className={"dst-header-container dst-psa-logo"} item>
          <img alt="neccc" src={"./PSALogo.png"} />
        </Grid>
      ) : (
        <Grid
          xs={12}
          item
          className={
            data.siteCondition.council === "MCCC"
              ? "dst-header-container dst-mccc-logo"
              : "dst-header-container dst-neccc-logo"
          }
        >
          <img
            alt="neccc"
            src={
              data.siteCondition.council === "MCCC"
                ? "./mccc-logo.png"
                : "./neccc-logo.png"
            }
          />
        </Grid>
      )}

      {/* <Header
        headerVariant="dstHeader"
        text="Seeding Rate Calculator"
        size={12}
        style={{ mt: 1, mb: 1.5 }}
      /> */}
      <StepsList
        steps={calculatorList}
        activeStep={activeStep}
        skipped={skipped}
        handleNext={handleNext}
        handleBack={handleBack}
        handleSkip={handleSkip}
        handleReset={handleReset}
        completedStep={completedStep}
        setCompletedStep={setCompletedStep}
        className="steps-container"
      />
      {renderCalculator(
        activeStep === calculatorList.length
          ? "Finish"
          : calculatorList[activeStep]
      )}
    </Grid>
  );
};
export default Calculator;
