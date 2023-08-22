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
  CompletedPage,
} from "./Steps";
import { useParams } from "react-router-dom";
import { calculatorList } from "../../shared/data/dropdown";
import { Header } from "../../components/Header";
import { StepsList } from "../../components/StepsList";
import "./calculator.css";

const Calculator = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const { type } = useParams();
  const renderCalculator = (step) => {
    switch (step) {
      case "Site Condition":
        return <SiteCondition council={type} />;
      case "Species Selection":
        return <SpeciesSelection council={type} />;
      case "Mix Ratios":
        return <MixRatio council={type} />;
      case "Mix Seeding Rate":
        return <MixSeedingRate council={type} />;
      case "Seeding Method":
        return <SeedingMethod council={type} />;
      case "Seed Tag Info":
        return <SeedTagInfo council={type} />;
      case "Review Mix":
        return <ReviewMix council={type} />;
      case "Confirm Plan":
        return <ConfirmPlan council={type} />;
      case "Finish":
        return <CompletedPage council={type} />;
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
      {renderCalculator(
        activeStep === calculatorList.length
          ? "Finish"
          : calculatorList[activeStep]
      )}
    </Grid>
  );
};
export default Calculator;
