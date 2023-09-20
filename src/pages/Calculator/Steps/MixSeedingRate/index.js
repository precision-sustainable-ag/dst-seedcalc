//////////////////////////////////////////////////////////
//                    Imports                           //
//////////////////////////////////////////////////////////

import * as React from "react";
import Grid from "@mui/material/Grid";
import { useSelector, useDispatch } from "react-redux";
import { Typography, Box } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { updateSteps } from "../../../../features/stepSlice";
import { seedingMethods } from "../../../../shared/data/dropdown";
import { Dropdown } from "../../../../components/Dropdown";
import "./../steps.css";
import SeedsSelectedList from "../../../../components/SeedsSelectedList";

const MixSeedingRate = ({ council }) => {
  // themes
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down("xs"));
  const matchesSm = useMediaQuery(theme.breakpoints.down("sm"));
  const matchesMd = useMediaQuery(theme.breakpoints.down("md"));

  // useSelector for crops reducer data
  const dispatch = useDispatch();
  const data = useSelector((state) => state.steps.value);
  const { seedingMethod, speciesSelection } = data;
  const seedsSelected = speciesSelection.seedsSelected;

  //////////////////////////////////////////////////////////
  //                      Redux                           //
  //////////////////////////////////////////////////////////

  const handleUpdateSteps = (key, val) => {
    const data = {
      type: "seedingMethod",
      key: key,
      value: val,
    };
    dispatch(updateSteps(data));
  };

  //////////////////////////////////////////////////////////
  //                   State Logic                        //
  //////////////////////////////////////////////////////////

  const handleSeedingMethod = (e) => {
    handleUpdateSteps("type", e.target.value);
  };
  const renderSeedsSelected = () => {
    return <SeedsSelectedList list={seedsSelected} />;
  };
  const renderRightAccordian = (type, val) => {
    return (
      <Grid item xs={6} className="mix-seeding-rate-grid-right">
        {council === "NECCC" && type !== "precision" ? (
          <Typography>Not Recommended</Typography>
        ) : (
          <>
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
              <Typography>{val}</Typography>
            </Box>
            <Typography>Lbs / Acre</Typography>
          </>
        )}
      </Grid>
    );
  };

  const renderAccordian = (seed) => {
    return (
      <Accordion xs={12} className="accordian-container">
        <AccordionSummary
          xs={12}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>{seed.label}</Typography>
        </AccordionSummary>
        <AccordionDetails className="accordian-details">
          <Grid xs={12} container>
            <Grid item xs={6} className="mix-seeding-rate-grid-left">
              <Typography>Precision: </Typography>
            </Grid>
            {renderRightAccordian("precision", seed.precision)}
            <Grid item xs={6} className="mix-seeding-rate-grid-left">
              <Typography>Drilled: </Typography>
            </Grid>
            {renderRightAccordian("drilled", 1)}
            <Grid item xs={6} className="mix-seeding-rate-grid-left">
              <Typography>Broadcast(with Light Incorporation): </Typography>
            </Grid>
            {renderRightAccordian("broadcast", seed.broadcast)}
            <Grid item xs={6} className="mix-seeding-rate-grid-left">
              <Typography>
                Aerial(or broadcast with no Light Incorporation{" "}
                <span className="red-text">Not Recommended</span>):{" "}
              </Typography>
            </Grid>
            {renderRightAccordian("aerial", seed.aerial)}
          </Grid>
        </AccordionDetails>
      </Accordion>
    );
  };

  //////////////////////////////////////////////////////////
  //                    Render                            //
  //////////////////////////////////////////////////////////

  return (
    <Grid xs={12} container>
      {seedsSelected.length > 0 && renderSeedsSelected()}
      <Grid
        xs={seedsSelected.length > 0 ? 12 : 12}
        md={seedsSelected.length > 0 ? 11 : 12}
        item
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12}>
          <Typography variant="h2">Mix Seeding Rate</Typography>
        </Grid>
        <Grid item xs={12} padding={15} className="site-condition-container">
          <Dropdown
            value={seedingMethod.type}
            label={"Seeding Method: "}
            handleChange={handleSeedingMethod}
            size={12}
            items={seedingMethods}
          />
        </Grid>
        <Grid item xs={12}>
          {seedsSelected.map((s, i) => {
            return (
              <Grid xs={12}>
                <Grid item>{renderAccordian(s)}</Grid>
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </Grid>
  );
};
export default MixSeedingRate;
