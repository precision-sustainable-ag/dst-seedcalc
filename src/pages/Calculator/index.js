//////////////////////////////////////////////////////////
//                      Imports                         //
//////////////////////////////////////////////////////////

import { useEffect, useRef, useState } from "react";
import Grid from "@mui/material/Grid";
import { useSelector } from "react-redux";
import { Typography, useMediaQuery, Box } from "@mui/material";

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
import SeedsSelectedList from "../../components/SeedsSelectedList";

import { calculatorList, completedList } from "../../shared/data/dropdown";
import { StepsList } from "../../components/StepsList";
import { useTheme } from "@mui/material/styles";

const Calculator = () => {
  const data = useSelector((state) => state.steps.value);
  const type = data.siteCondition.council;
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [completedStep, setCompletedStep] = useState([...completedList]);
  const [showHeaderLogo, setShowHeaderLogo] = useState(true);

  const stepperRef = useRef();

  const theme = useTheme();
  const matchesSm = useMediaQuery(theme.breakpoints.down("sm"));

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

  const headerLogo = () => {
    if (data.siteCondition.council === "") return "./PSALogo.png";
    else if (data.siteCondition.council === "MCCC") return "./mccc-logo.png";
    else if (data.siteCondition.council === "NECCC") return "./neccc-logo.png";
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 85) {
        // Adjust the scroll threshold as needed
        setShowHeaderLogo(false);
      } else {
        setShowHeaderLogo(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} paddingTop={"0.625rem"} height={"85px"}>
        <img
          alt={data.siteCondition.council}
          src={headerLogo()}
          height={"75px"}
        />
      </Grid>

      <Grid item md={0} lg={2}></Grid>
      <Grid
        item
        xs={12}
        lg={8}
        sx={
          matchesSm && !showHeaderLogo
            ? {
                position: "fixed",
                width: "100%",
                paddingTop: "20px",
                backgroundColor: "primary.light",
                height: "90px",
                zIndex: "101",
              }
            : { paddingTop: "20px" }
        }
        // height={"100px"}
        ref={stepperRef}
      >
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
        />
      </Grid>
      <Grid item md={0} lg={2}></Grid>

      <Grid item md={0} lg={2}></Grid>

      {activeStep > 0 && activeStep < 8 && (
        <Grid
          item
          xs={12}
          md={1}
          sx={
            matchesSm && !showHeaderLogo
              ? {
                  position: "fixed",
                  width: "100%",
                  paddingTop: "90px",
                  zIndex: "100",
                }
              : {}
          }
        >
          <SeedsSelectedList list={data.speciesSelection.seedsSelected} />
        </Grid>
      )}

      <Grid
        item
        xs={12}
        lg={7}
        md={activeStep > 0 ? 11 : 12}
        sx={
          matchesSm && !showHeaderLogo
            ? activeStep === 0
              ? { paddingTop: "90px" }
              : { paddingTop: "190px" }
            : {}
        }
      >
        {renderCalculator(
          activeStep === calculatorList.length
            ? "Finish"
            : calculatorList[activeStep]
        )}
      </Grid>

      <Grid item md={0} lg={2}></Grid>
    </Grid>
  );
};
export default Calculator;
