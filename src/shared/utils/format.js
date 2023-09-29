export const isEmptyNull = (val) => {
  return val == null || val === "";
};

export const validateForms = (pass, index, completedStep, setCompletedStep) => {
  if (pass) {
    const updatedStep = [...completedStep];
    updatedStep[index] = true;
    setCompletedStep(updatedStep);
  } else {
    const updatedStep = [...completedStep];
    updatedStep[index] = false;
    setCompletedStep(updatedStep);
  }
};
