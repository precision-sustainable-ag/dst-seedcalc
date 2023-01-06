import { useState } from "react";
import Grid from "@mui/material/Grid";
import {
  SiteCondition,
  SpeciesSelection,
  MixRatio,
  MixSeedingRate,
  SeedTagInfo,
  ReviewMix,
  ConfirmPlan,
  SeedingMethod,
} from "./Steps";
import { calculatorList } from "../../shared/data/dropdown";
import { Header } from "../../components/Header";
import { StepsList } from "../../components/StepsList";
import "./calculator.css";

const Calculator = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());

  const renderCalculator = (step) => {
    switch (step) {
      case "Site Condition":
        return <SiteCondition />;
      case "Species Selection":
        return <SpeciesSelection />;
      case "Mix Ratios":
        return <MixRatio />;
      case "Mix Seeding Rate":
        return <MixSeedingRate />;
      case "Seeding Method":
        return <SeedingMethod />;
      case "Seed Tag Info":
        return <SeedTagInfo />;
      case "Review Mix":
        return <ReviewMix />;
      case "Confirm Plan":
        return <ConfirmPlan />;
      default:
        return;
    }
  };

  // Steps List Logic

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

  return (
    <Grid container justifyContent="center" alignItems="center">
      <Header
        headerVariant="dstHeader"
        text="Seeding Rate Calculator"
        size={12}
        style={{ mt: 1, mb: 1.5 }}
      />
      <StepsList
        steps={calculatorList}
        activeStep={activeStep}
        skipped={skipped}
        handleNext={handleNext}
        handleBack={handleBack}
        handleSkip={handleSkip}
        handleReset={handleReset}
        className="steps-container"
      />
      {renderCalculator(calculatorList[activeStep])}
    </Grid>
  );
};
export default Calculator;
