import Grid from "@mui/material/Grid";
import { Typography, Box, Button } from "@mui/material";

import { NumberTextField } from "./../../../../components/NumberTextField";
import {
  convertToPercent,
  convertToDecimal,
} from "./../../../../shared/utils/calculate";
import "./../steps.scss";

const ReviewMixSteps = ({
  speciesSelection,
  council,
  renderStepsForm,
  updateSeed,
  seedingMethod,
  siteCondition,
  seed,
}) => {
  const generatePercentInGroup = (seed) => {
    const group = seed.group.label;
    let count = 0;
    speciesSelection.seedsSelected.map((s, i) => {
      s.group.label === group && count++;
    });
    return 1 / count;
  };
  const percentInGroup = generatePercentInGroup(seed);

  return (
    <Grid container xs={12}>
      {/* NECCC Step 1:  */}
      {council === "NECCC" && (
        <>
          <Grid item xs={12}>
            <Typography className="mix-ratio-step-header">Step 1: </Typography>
          </Grid>
          {renderStepsForm(
            "Mix Seeding Rate PLS",
            "% in Group",
            "% of Single Species Seeding Rate"
          )}
          <Grid item xs={3}>
            <NumberTextField
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
              label="% in Group"
              variant="filled"
              disabled={true}
              value={convertToPercent(percentInGroup)}
            />
          </Grid>
          <Grid item xs={1}>
            <Typography className="math-icon">x</Typography>
          </Grid>
          <Grid item xs={3}>
            <NumberTextField
              label="% of Single Species Rate"
              variant="filled"
              disabled={false}
              handleChange={(e) => {
                updateSeed(e.target.value, "percentOfSingleSpeciesRate", seed);
              }}
              value={seed.percentOfSingleSpeciesRate}
            />
            <Typography>{council === "MCCC" ? "MCCC" : "NECCC"}</Typography>
          </Grid>
          <Grid container className="steps-row-2" xs={12}>
            <Grid item xs={4}>
              <Typography className="math-icon">=</Typography>
            </Grid>
            <Grid item xs={7}>
              <NumberTextField
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
          {renderStepsForm(
            "Single Species Seeding Rate PLS",
            "% of Single Species Rate",
            "Mix Seeding Rate"
          )}
          <Grid container xs={12} className="mix-ratio-form-container">
            <Grid item xs={3}>
              <NumberTextField
                disabled={true}
                label="Single Species Seeding Rate PLS"
                variant="filled"
                handleChange={(e) => {
                  updateSeed(e.target.value, "singleSpeciesSeedingRate", seed);
                }}
                value={seed.singleSpeciesSeedingRate}
              />
              <Typography className="font-15">Lbs / Acre</Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography className="math-icon">X</Typography>
            </Grid>
            <Grid item xs={3}>
              <NumberTextField
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
              <Typography className="font-15">
                {council === "MCCC" && "MCCC Recommendation"}
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography className="math-icon">=</Typography>
            </Grid>
            <Grid item xs={3}>
              <NumberTextField
                label="Mix Seeding Rate"
                disabled={true}
                variant="filled"
                value={seed.step1Result}
              />
              <Typography className="font-15">Lbs / Acre</Typography>
            </Grid>
          </Grid>
        </>
      )}

      {/* MCCC Step 1 END */}
      <Grid item xs={12}>
        <Typography className="mix-ratio-step-header">Step 2: </Typography>
      </Grid>
      {renderStepsForm(
        "Mix Seeding Rate PLS",
        "Planting Method",
        "Mix Seeding Rate PLS"
      )}
      <Grid item xs={3}>
        <NumberTextField
          disabled={true}
          label="Mix Seeding Rate PLS"
          variant="filled"
          value={seed.step1Result}
        />
        <Typography className="font-15">Lbs / Acre</Typography>
      </Grid>
      <Grid item xs={1}>
        <Typography className="math-icon">X</Typography>
      </Grid>
      <Grid item xs={3}>
        <NumberTextField
          disabled={false}
          label="Planting Method"
          variant="filled"
          value={seed.plantingMethod}
        />
      </Grid>
      <Grid item xs={1}>
        <Typography className="math-icon">=</Typography>
      </Grid>
      <Grid item xs={3}>
        <NumberTextField
          label="Mix Seeding Rate PLS"
          variant="filled"
          disabled={true}
          value={seed.step2Result}
        />
        <Typography className="font-15">Lbs / Acre</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography className="mix-ratio-step-header">Step 3: </Typography>
      </Grid>
      {renderStepsForm(
        "Mix Seeding Rate PLS",
        "Mix Seeding Rate PLS",
        "Management impact on mix"
      )}
      {/*  */}
      <Grid item xs={3}>
        <NumberTextField
          label="Mix Seeding Rate PLS"
          variant="filled"
          disabled={true}
          value={seed.step2Result}
        />
      </Grid>
      <Grid item xs={1}>
        <Typography className="math-icon">+</Typography>
      </Grid>
      <Grid item xs={1}>
        <Typography className="math-icon">(</Typography>
      </Grid>
      <Grid item xs={2}>
        <NumberTextField
          label="Mix Seeding Rate PLS"
          variant="filled"
          disabled={true}
          handleChange={(e) => {
            updateSeed(e.target.value, "step2Result", seed);
          }}
          value={seed.step2Result}
        />
      </Grid>
      <Grid item xs={1}>
        <Typography className="math-icon">X</Typography>
      </Grid>
      <Grid item xs={2}>
        <NumberTextField
          label="Management Impact on Mix"
          variant="filled"
          disabled={true}
          handleChange={(e) => {
            updateSeed(e.target.value, "managementImpactOnMix", seed);
          }}
          value={seedingMethod.managementImpactOnMix.toFixed(2)}
        />
      </Grid>
      <Grid item xs={1}>
        <Typography className="math-icon">)</Typography>
      </Grid>
      <Grid item xs={1}></Grid>
      <Grid container className="steps-row-2" xs={12}>
        <Grid item xs={4}>
          <Typography className="math-icon">=</Typography>
        </Grid>
        <Grid item xs={7}>
          <NumberTextField
            label="Mix Seeding Rate PLS"
            variant="filled"
            disabled={true}
            value={seed.step3Result}
          />
        </Grid>
      </Grid>
      <Grid item xs={1}></Grid>
      {/*  */}
      <Grid item xs={12}>
        <Typography className="mix-ratio-step-header">Step 4: </Typography>
      </Grid>
      {renderStepsForm("Mix Seeding Rate PLS", "% Germination", "% Purity")}
      <Grid item xs={3}>
        <NumberTextField
          label="Mix Seeding Rate PLS"
          variant="filled"
          disabled={true}
          value={seed.step3Result}
        />
        <Typography className="font-15">Lbs / Acre</Typography>
      </Grid>

      <Grid item xs={1}>
        <Typography className="math-icon">÷</Typography>
      </Grid>
      <Grid item xs={3}>
        <NumberTextField
          label="% Germination"
          variant="filled"
          disabled={false}
          handleChange={(e) => {
            updateSeed(
              convertToDecimal(e.target.value),
              "germinationPercentage",
              seed
            );
          }}
          value={convertToPercent(seed.germinationPercentage)}
        />
      </Grid>
      <Grid item xs={1}>
        <Typography className="math-icon">÷</Typography>
      </Grid>
      <Grid item xs={3}>
        <NumberTextField
          label="% Purity"
          variant="filled"
          disabled={false}
          handleChange={(e) => {
            updateSeed(
              convertToDecimal(e.target.value),
              "purityPercentage",
              seed
            );
          }}
          value={convertToPercent(seed.purityPercentage)}
        />
        <Typography className="font-15">Lbs / Acre</Typography>
      </Grid>
      <Grid container className="steps-row-2" xs={12}>
        <Grid item xs={4}>
          <Typography className="math-icon">=</Typography>
        </Grid>
        <Grid item xs={7}>
          <NumberTextField
            label="Bulk Seeding Rate"
            variant="filled"
            disabled={true}
            value={seed.bulkSeedingRate}
          />
        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>
      {/*  */}
      <Grid item xs={12}>
        <Typography className="mix-ratio-step-header">Step 5: </Typography>
      </Grid>
      {renderStepsForm("Bulk Seeding Rate", "Acres", "Pounds for Purchase")}
      <Grid item xs={3}>
        <NumberTextField
          label="Bulk Seeding Rate"
          variant="filled"
          disabled={true}
          value={seed.bulkSeedingRate}
        />
        <Typography className="font-15">Lbs / Acre</Typography>
      </Grid>
      <Grid item xs={1}>
        <Typography className="math-icon">x</Typography>
      </Grid>
      <Grid item xs={3}>
        <NumberTextField
          label="Acres"
          variant="filled"
          disabled={true}
          handleChange={(e) => {
            updateSeed(e.target.value, "acres", seed);
          }}
          value={siteCondition.acres}
        />
      </Grid>
      <Grid item xs={1}>
        <Typography className="math-icon">=</Typography>
      </Grid>
      <Grid item xs={3}>
        <NumberTextField
          label="Pounds for Purchase"
          variant="filled"
          disabled={true}
          value={seed.poundsForPurchase}
        />
        <Typography>Lbs / Acre</Typography>
      </Grid>
    </Grid>
  );
};
export default ReviewMixSteps;
