import { Typography, Box, Button } from "@mui/material";

const SeedingRateChip = ({ label, value }) => {
  return (
    <>
      <Typography>{label}</Typography>
      <Box
        sx={{
          width: "50px",
          height: "50px",
          padding: "11px",
          margin: "0 auto",
          backgroundColor: "#E5E7D5",
          border: "#C7C7C7 solid 1px",
          borderRadius: "50%",
        }}
      >
        <Typography>{value}</Typography>
      </Box>
      <Typography>Lbs / Acre</Typography>
    </>
  );
};

const SeedDataChip = ({ label, value }) => {
  return (
    <>
      <Box
        sx={{
          width: "110px",
          height: "50px",
          padding: "11px",
          margin: "0 auto",
          backgroundColor: "#E5E7D5",
          border: "#C7C7C7 solid 1px",
          borderRadius: "16px",
        }}
      >
        <Typography>{value}</Typography>
      </Box>
      <Typography>{label}</Typography>
      {/* FIXME: currently there's no function to these buttons */}
      <Button variant="outlined">Sqft</Button>
      {"   "}
      <Button variant="contained">Acres</Button>
    </>
  );
};

export { SeedingRateChip, SeedDataChip };
