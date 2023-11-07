import Grid from "@mui/material/Grid";

import "./../steps.scss";

const StripedLabels = ({ seed, data, labels }) => {
  const labels2 = [
    { label: "Species Modifications" },
    { label: "Species Review" },
    { label: "Pounds for Purchase" },
  ];
  return (
    <>
      {labels.map((l, i) => {
        return (
          <Grid
            container
            sx={{ backgroundColor: !(i % 2) && "#e3e5d3" }}
            xs={12}
          >
            <Grid item sx={{ textAlign: "justify" }} xs={10} pl={1}>
              {l.label}
            </Grid>
            <Grid item xs={2}>
              {l.val}
            </Grid>
          </Grid>
        );
      })}
    </>
  );
};

export default StripedLabels;
