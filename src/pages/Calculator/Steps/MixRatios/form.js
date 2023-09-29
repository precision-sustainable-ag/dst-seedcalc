import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";

import {
  convertToPercent,
  convertToDecimal,
} from "./../../../../shared/utils/calculate";
import { NumberTextField } from "./../../../../components/NumberTextField";
import "./../steps.css";

const MixRatioSteps = ({
  seed,
  council,
  renderFormLabel,
  updateSeed,
  generatePercentInGroup,
}) => {
  const percentInGroup = generatePercentInGroup(seed);
  return (
    <Grid container xs={12}>
      {/* NECCC Step 1:  */}
      {council === "NECCC" && (
        <>
          <Grid item xs={12}>
            <Typography className="mix-ratio-step-header">Step 1: </Typography>
          </Grid>
          {renderFormLabel(
            "Mix Seeding Rate PLS",
            "% in Group",
            "% of Single Species Seeding Rate"
          )}
          <Grid item xs={3}>
            <NumberTextField
              className="text-field-100"
              id="filled-basic"
              disabled={false}
              label="Single Species Seeding Rate PLS"
              variant="filled"
              handleChange={(e) => {
                updateSeed(e.target.value, "singleSpeciesSeedingRatePLS", seed);
              }}
              value={seed.singleSpeciesSeedingRatePLS}
            />
            <Typography>Lbs / Acre</Typography>
          </Grid>

          <Grid item xs={1}>
            <Typography className="math-icon">x</Typography>
          </Grid>
          <Grid item xs={3}>
            <NumberTextField
              className="text-field-100"
              id="filled-basic"
              label="% in Group"
              variant="filled"
              disabled={true}
              value={Math.round(convertToPercent(percentInGroup))}
            />
          </Grid>
          <Grid item xs={1}>
            <Typography className="math-icon">x</Typography>
          </Grid>
          <Grid item xs={3}>
            <NumberTextField
              className="text-field-100"
              id="filled-basic"
              label="% of Single Species Rate"
              variant="filled"
              disabled={false}
              handleChange={(e) => {
                updateSeed(e.target.value, "percentOfSingleSpeciesRate", seed);
              }}
              value={Math.round(seed.percentOfSingleSpeciesRate)}
            />
            <Typography>{council === "MCCC" ? "MCCC" : "NECCC"}</Typography>
          </Grid>
          <Grid container className="steps-row-2" xs={12}>
            <Grid item xs={4}>
              <Typography className="math-icon">=</Typography>
            </Grid>
            <Grid item xs={7}>
              <NumberTextField
                className="text-field-100"
                id="filled-basic"
                label="Mix Seeding Rate"
                disabled={true}
                variant="filled"
                value={seed.mixSeedingRate}
              />
              <Typography>Lbs / Acre</Typography>
            </Grid>
            <Grid item xs={1}></Grid>
          </Grid>
        </>
      )}
      {/* NECCC Step 1 END */}

      {/* MCCC Step 1 START */}
      {council === "MCCC" && (
        <>
          <Grid item xs={12}>
            <Typography className="mix-ratio-step-header">Step 1:</Typography>
          </Grid>
          {renderFormLabel(
            "Single Species Seeding Rate PLS",
            "% of Single Species Rate",
            "Mix Seeding Rate"
          )}
          <Grid container xs={12} className="mix-ratio-form-container">
            <Grid item xs={3}>
              <NumberTextField
                className="text-field-100"
                id="filled-basic"
                disabled={false}
                label="Single Species Seeding Rate PLS"
                variant="filled"
                handleChange={(e) => {
                  updateSeed(
                    e.target.value,
                    "singleSpeciesSeedingRatePLS",
                    seed
                  );
                }}
                value={seed.singleSpeciesSeedingRatePLS}
              />
              <Typography>Lbs / Acre</Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography className="math-icon">X</Typography>
            </Grid>
            <Grid item xs={3}>
              <NumberTextField
                className="text-field-100"
                id="filled-basic"
                label="% of Single Species Rate"
                variant="filled"
                disabled={false}
                handleChange={(e) => {
                  updateSeed(
                    e.target.value,
                    "percentOfSingleSpeciesRate",
                    seed
                  );
                }}
                value={seed.percentOfSingleSpeciesRate}
              />
              <Typography>{council === "MCCC" ? "MCCC" : "NECCC"}</Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography className="math-icon">=</Typography>
            </Grid>
            <Grid item xs={3}>
              <NumberTextField
                className="text-field-100"
                id="filled-basic"
                label="Mix Seeding Rate"
                disabled={true}
                variant="filled"
                value={seed.mixSeedingRate}
              />
              <Typography>Lbs / Acre</Typography>
            </Grid>
          </Grid>
        </>
      )}

      {/* MCCC Step 1 END */}
      <Grid item xs={12}>
        <Typography className="mix-ratio-step-header">Step 2: </Typography>
      </Grid>
      {renderFormLabel(
        "Single Species Seeding Rate PLS",
        "% of Single Species Rate",
        "Mix Seeding Rate"
      )}
      <Grid item xs={3}>
        <NumberTextField
          className="text-field-100"
          id="filled-basic"
          disabled={true}
          label="Seeds / Pound"
          variant="filled"
          handleChange={(e) => {
            updateSeed(e.target.value, "seedsPerPound", seed);
          }}
          value={seed.seedsPerPound}
        />
      </Grid>
      <Grid item xs={1}>
        <Typography className="math-icon">X</Typography>
      </Grid>
      <Grid item xs={3}>
        <NumberTextField
          className="text-field-100"
          id="filled-basic"
          disabled={true}
          label="Mix Seeding Rate"
          variant="filled"
          value={seed.mixSeedingRate}
        />
        <Typography>Lbs / Acre</Typography>
      </Grid>
      <Grid item xs={1}>
        <Typography className="math-icon">=</Typography>
      </Grid>
      <Grid item xs={3}>
        <NumberTextField
          className="text-field-100"
          id="filled-basic"
          label="Seeds / Acre"
          variant="filled"
          disabled={true}
          value={seed.seedsPerAcre}
        />
      </Grid>
      {council === "NECCC" && (
        <>
          {" "}
          <Grid item xs={12}>
            <Typography className="mix-ratio-step-header">Step 3: </Typography>
          </Grid>
          {renderFormLabel("Seeds/Acre", "Sq. Ft. / Acres", "Plants/Acre")}
          <Grid item xs={3}>
            <NumberTextField
              className="text-field-100"
              id="filled-basic"
              label="Seeds / Acre"
              variant="filled"
              disabled={true}
              value={seed.seedsPerAcre}
            />
          </Grid>
          <Grid item xs={1}>
            <Typography className="math-icon">÷</Typography>
          </Grid>
          <Grid item xs={3}>
            <NumberTextField
              className="text-field-100"
              id="filled-basic"
              label="Sq. Ft./ Acre"
              variant="filled"
              disabled={true}
              value={seed.sqFtAcre}
            />
          </Grid>
          <Grid item xs={1}>
            <Typography className="math-icon">=</Typography>
          </Grid>
          <Grid item xs={3}>
            <NumberTextField
              className="text-field-100"
              id="filled-basic"
              label="Seeds / Sq. Ft."
              variant="filled"
              disabled={true}
              value={seed.aproxPlantsSqFt}
            />
          </Grid>
        </>
      )}
      {council === "MCCC" && (
        <>
          <Grid item xs={12}>
            <Typography className="mix-ratio-step-header">Step 3: </Typography>
          </Grid>
          {renderFormLabel("Seeds/Acre", "% Survival", "Plants/Acre")}
          <Grid item xs={3}>
            <NumberTextField
              className="text-field-100"
              id="filled-basic"
              label="Seeds / Acre"
              variant="filled"
              disabled={true}
              value={seed.seedsPerAcre}
            />
          </Grid>
          <Grid item xs={1}>
            <Typography className="math-icon">X</Typography>
          </Grid>
          <Grid item xs={3}>
            <NumberTextField
              className="text-field-100"
              id="filled-basic"
              label="% Survival"
              variant="filled"
              disabled={false}
              handleChange={(e) => {
                updateSeed(
                  convertToDecimal(e.target.value),
                  "percentChanceOfWinterSurvival",
                  seed
                );
              }}
              value={convertToPercent(seed.percentChanceOfWinterSurvival)}
            />
          </Grid>
          <Grid item xs={1}>
            <Typography className="math-icon">=</Typography>
          </Grid>
          <Grid item xs={3}>
            <NumberTextField
              className="text-field-100"
              id="filled-basic"
              label="Plants / Acre"
              variant="filled"
              disabled={true}
              value={seed.plantsPerAcre}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography className="mix-ratio-step-header">Step 4: </Typography>
          </Grid>
          {renderFormLabel(
            "Plants/Acre",
            "Sq.Ft./Acre",
            "Aproximate Plants/Sq.Ft."
          )}
          <Grid item xs={3}>
            <NumberTextField
              className="text-field-100"
              id="filled-basic"
              label="Plants / Acre"
              variant="filled"
              disabled={true}
              value={seed.plantsPerAcre}
            />
          </Grid>
          <Grid item xs={1}>
            <Typography className="math-icon">÷</Typography>
          </Grid>
          <Grid item xs={3}>
            <NumberTextField
              className="text-field-100"
              id="filled-basic"
              label="Sq. Ft./ Acre"
              variant="filled"
              disabled={true}
              value={seed.sqFtAcre}
            />
          </Grid>
          <Grid item xs={1}>
            <Typography className="math-icon">=</Typography>
          </Grid>
          <Grid item xs={3}>
            <NumberTextField
              className="text-field-100"
              id="filled-basic"
              label="Aproximate Plants  / Sq. Ft."
              variant="filled"
              disabled={true}
              value={seed.aproxPlantsSqFt}
            />
            <Typography>Lbs / Acre</Typography>
          </Grid>
        </>
      )}
    </Grid>
  );
};
export default MixRatioSteps;
