import { useState } from "react";
import Grid from "@mui/material/Grid";
import CircleIcon from "@mui/icons-material/Circle";
import { useSelector, useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import {
  SiteCondition,
  SpeciesSelection,
  MixRatio,
  MixSeedingRate,
  SeedTagInfo,
  ReviewMix,
  ConfirmPlan,
} from "./Steps";
import { Header } from "./../../components/Header";
import { StepsList } from "./../../components/StepsList";
import { addFilter } from "./../../features/filter/filterSlice";

const stepsList = [
  "Site Condition",
  "Species Selection",
  "Mix Ratios",
  "Mix Seeding Rate",
  "Seed Tag Info",
  "Review Mix",
  "Confirm Plan",
];
const Filter = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());

  const filters = useSelector((state) => state.filter.value);
  const onTitleChanged = (e) => setTitle(e.target.value);
  const onContentChanged = (e) => setContent(e.target.value);
  const dispatch = useDispatch();

  const renderFilter = (step) => {
    console.log("handle route ", step);
    console.log("active step list", activeStep);
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
        steps={stepsList}
        activeStep={activeStep}
        skipped={skipped}
        handleNext={handleNext}
        handleBack={handleBack}
        handleSkip={handleSkip}
        handleReset={handleReset}
        className="steps-container"
      />
      {renderFilter(stepsList[activeStep])}
      <h2 style={{ display: "none" }}>Add a new post</h2>
      <form style={{ display: "none" }}>
        <label htmlFor="postTitle">Post title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitleChanged}
        ></input>
        <label htmlFor="postContent">Post content:</label>
        <input
          type="text"
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        ></input>
      </form>
      <Button
        style={{ display: "none" }}
        variant="contained"
        onClick={() => {
          dispatch(
            addFilter({
              id: filters[filters.length - 1].id + 1,
              title: title,
              content: content,
            })
          );
        }}
      >
        Submit
      </Button>
    </Grid>
  );
};
export default Filter;
