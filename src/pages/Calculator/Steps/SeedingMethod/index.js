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
import { updateSteps } from "../../../../features/stepSlice";
import { seedingMethods } from "../../../../shared/data/dropdown";
import { Dropdown } from "../../../../components/Dropdown";
import styled from "@emotion/styled";
import "./../steps.scss";

const LeftGrid = styled(Grid)(() => ({
  "&.MuiGrid-item": {
    height: "150px",
    border: "1px solid #c7c7c7",
    borderLeft: "none",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "& p": {
      fontWeight: "bold",
    },
  },
}));

const RightGrid = styled(Grid)(() => ({
  "&.MuiGrid-item": {
    height: "150px",
    border: "1px solid #c7c7c7",
    borderRight: "none",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    "& .MuiBox-root": {
      width: "50px",
      height: "50px",
      padding: "11px",
      margin: "0 auto",
      backgroundColor: "#E5E7D5",
      border: "solid 2px",
      borderRadius: "50%",
    },
    "& p": {
      fontWeight: "bold",
    },
  },
}));

const SeedingMethod = ({ council }) => {
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

  const renderRightAccordian = (type, val) => {
    return (
      <RightGrid item xs={6}>
        {council === "NECCC" && type !== "precision" ? (
          <Typography>Not Recommended</Typography>
        ) : (
          <>
            <Box>
              <Typography>{val}</Typography>
            </Box>
            <Typography>Lbs / Acre</Typography>
          </>
        )}
      </RightGrid>
    );
  };

  //////////////////////////////////////////////////////////
  //                    Render                            //
  //////////////////////////////////////////////////////////

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h2">Select Seeding Method</Typography>
      </Grid>
      <Grid item xs={12} padding={"15px"} className="">
        <Dropdown
          value={seedingMethod.type}
          label={"Seeding Method: "}
          handleChange={handleSeedingMethod}
          size={12}
          items={seedingMethods}
        />
      </Grid>
      {seedsSelected.map((seed, i) => {
        return (
          <Grid item xs={12} key={i}>
            <Accordion className="accordian-container">
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                className="accordian-summary"
              >
                <Typography>{seed.label}</Typography>
              </AccordionSummary>

              <AccordionDetails className="accordian-details">
                <Grid container>
                  <LeftGrid item xs={6}>
                    <Typography>Precision: </Typography>
                  </LeftGrid>
                  {renderRightAccordian("precision", seed.precision)}
                  <LeftGrid item xs={6}>
                    <Typography>Drilled: </Typography>
                  </LeftGrid>
                  {renderRightAccordian("drilled", 1)}
                  <LeftGrid item xs={6}>
                    <Typography>
                      Broadcast(with Light Incorporation):{" "}
                    </Typography>
                  </LeftGrid>
                  {renderRightAccordian("broadcast", seed.broadcast)}
                  <LeftGrid item xs={6}>
                    <Typography>
                      Aerial(or broadcast with no Light Incorporation{" "}
                      <span style={{ color: "red" }}>Not Recommended</span>
                      ):
                    </Typography>
                  </LeftGrid>
                  {renderRightAccordian("aerial", seed.aerial)}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        );
      })}
    </Grid>
  );
};
export default SeedingMethod;
