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
} from "./Steps";
import { filterList } from "./../../shared/data/dropdown";
import { Header } from "./../../components/Header";
import { StepsList } from "./../../components/StepsList";

const Filter = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());

  const renderFilter = (step) => {
    switch (step) {
      case "Site Condition":
        return <SiteCondition />;
      case "Species Selection":
        return <SpeciesSelection />;
      case "Mix Ratios":
        return <MixRatio />;
      case "Mix Seeding Rate":
        return <MixSeedingRate />;
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
        type="filter"
        headerClass="dst-header"
        text="Seeding Rate Calculator"
        size={12}
      />
      <StepsList
        steps={filterList}
        activeStep={activeStep}
        skipped={skipped}
        handleNext={handleNext}
        handleBack={handleBack}
        handleSkip={handleSkip}
        handleReset={handleReset}
        className="steps-container"
      />
      {renderFilter(filterList[activeStep])}
    </Grid>
  );
};
export default Filter;
