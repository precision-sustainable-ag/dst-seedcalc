export const calculateInt = (nums, type) => {
  switch (type) {
    case "add":
      return parseInt(nums[0]) + parseInt(nums[1]);
    case "subtract":
      return parseInt(nums[0]) - parseInt(nums[1]);
    case "multiply":
      return parseInt(nums[0]) * parseInt(nums[1]);
    case "divide":
      return parseInt(nums[0]) / parseInt(nums[1]);
    default:
      return;
  }
};
