import Grid from "@mui/material/Grid";
import { Typography, useTheme, useMediaQuery } from "@mui/material";

import { NumberTextField } from "./../../../../components/NumberTextField";
import {
  convertToPercent,
  convertToDecimal,
} from "./../../../../shared/utils/calculate";
import "./../steps.scss";

const ReviewMixSteps = ({
  speciesSelection,
  council,
  updateSeed,
  seedingMethod,
  siteCondition,
  seed,
}) => {
  const theme = useTheme();
  const matchesMd = useMediaQuery(theme.breakpoints.down("md"));

  const renderStepsForm = (label1, label2, label3) => {
    return (
      matchesMd && (
        <Grid container>
          <Grid item xs={3}>
            <Typography sx={{ fontSize: "0.75rem", pb: "1rem" }}>
              {label1}
            </Typography>
          </Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={3}>
            <Typography sx={{ fontSize: "0.75rem", pb: "1rem" }}>
              {label2}
            </Typography>
          </Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={3}>
            <Typography sx={{ fontSize: "0.75rem", pb: "1rem" }}>
              {label3}
            </Typography>
          </Grid>
        </Grid>
      )
    );
  };

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
    <Grid container>
      {/* NECCC Step 1:  */}
      {council === "NECCC" && (
        <>
          <Grid item xs={12}>
            <Typography className="step-header">Step 1: </Typography>
          </Grid>
          {renderStepsForm(
            "Mix Seeding Rate PLS",
            "% in Group",
            "% of Single Species Seeding Rate"
          )}
          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? "" : "Single Species Seeding Rate PLS"}
              handleChange={(e) => {
                updateSeed(e.target.value, "singleSpeciesSeedingRatePLS", seed);
              }}
              value={seed.singleSpeciesSeedingRatePLS}
            />
            <Typography>Lbs / Acre</Typography>
          </Grid>

          <Grid item xs={1}>
            <Typography className="math-icon">&#215;</Typography>
          </Grid>

          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? "" : "% in Group"}
              disabled
              value={convertToPercent(percentInGroup)}
            />
          </Grid>

          <Grid item xs={1}>
            <Typography className="math-icon">&#215;</Typography>
          </Grid>

          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? "" : "% of Single Species Rate"}
              handleChange={(e) => {
                updateSeed(e.target.value, "percentOfSingleSpeciesRate", seed);
              }}
              value={seed.percentOfSingleSpeciesRate}
            />
            <Typography>{council === "MCCC" ? "MCCC" : "NECCC"}</Typography>
          </Grid>

          <Grid container p={"10px"} xs={12}>
            <Grid item xs={4}>
              <Typography className="math-icon">=</Typography>
            </Grid>

            <Grid item xs={7}>
              <NumberTextField
                label={matchesMd ? "" : "Mix Seeding Rate"}
                disabled
                value={seed.mixSeedingRate}
              />
              <Typography>Lbs / Acre</Typography>
            </Grid>

            <Grid item xs={1}></Grid>
          </Grid>
        </>
      )}

      {/* MCCC Step 1: */}
      {council === "MCCC" && (
        <>
          <Grid item xs={12}>
            <Typography className="step-header">Step 1:</Typography>
          </Grid>
          {renderStepsForm(
            "Single Species Seeding Rate PLS",
            "% of Single Species Rate",
            "Mix Seeding Rate"
          )}
          <Grid container>
            <Grid item xs={3}>
              <NumberTextField
                disabled
                label={matchesMd ? "" : "Single Species Seeding Rate PLS"}
                handleChange={(e) => {
                  updateSeed(e.target.value, "singleSpeciesSeedingRate", seed);
                }}
                value={seed.singleSpeciesSeedingRate}
              />
              <Typography>Lbs / Acre</Typography>
            </Grid>

            <Grid item xs={1}>
              <Typography className="math-icon">&#215;</Typography>
            </Grid>

            <Grid item xs={3}>
              <NumberTextField
                label={matchesMd ? "" : "% of Single Species Rate"}
                handleChange={(e) => {
                  updateSeed(
                    e.target.value,
                    "percentOfSingleSpeciesRate",
                    seed
                  );
                }}
                value={seed.percentOfSingleSpeciesRate}
              />
              <Typography>
                {council === "MCCC" && "MCCC Recommendation"}
              </Typography>
            </Grid>

            <Grid item xs={1}>
              <Typography className="math-icon">=</Typography>
            </Grid>

            <Grid item xs={3}>
              <NumberTextField
                label={matchesMd ? "" : "Mix Seeding Rate"}
                disabled
                value={seed.step1Result}
              />
              <Typography>Lbs / Acre</Typography>
            </Grid>
          </Grid>
        </>
      )}

      {/* Step 2: */}
      <>
        <Grid item xs={12}>
          <Typography className="step-header">Step 2: </Typography>
        </Grid>
        {renderStepsForm(
          "Mix Seeding Rate PLS",
          "Planting Method",
          "Mix Seeding Rate PLS"
        )}
        <Grid item xs={3}>
          <NumberTextField
            disabled
            label={matchesMd ? "" : "Mix Seeding Rate PLS"}
            value={seed.step1Result}
          />
          <Typography>Lbs / Acre</Typography>
        </Grid>

        <Grid item xs={1}>
          <Typography className="math-icon">&#215;</Typography>
        </Grid>

        <Grid item xs={3}>
          <NumberTextField
            label={matchesMd ? "" : "Planting Method"}
            value={seed.plantingMethod}
          />
        </Grid>

        <Grid item xs={1}>
          <Typography className="math-icon">=</Typography>
        </Grid>

        <Grid item xs={3}>
          <NumberTextField
            label={matchesMd ? "" : "Mix Seeding Rate PLS"}
            disabled
            value={seed.step2Result}
          />
          <Typography>Lbs / Acre</Typography>
        </Grid>
      </>

      {/* Step 3: */}
      <>
        <Grid item xs={12}>
          <Typography className="step-header">Step 3: </Typography>
        </Grid>
        {renderStepsForm(
          "Mix Seeding Rate PLS",
          "Mix Seeding Rate PLS",
          "Management impact on mix"
        )}
        <Grid item xs={3}>
          <NumberTextField
            label={matchesMd ? "" : "Mix Seeding Rate PLS"}
            disabled
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
            label={matchesMd ? "" : "Mix Seeding Rate PLS"}
            disabled
            handleChange={(e) => {
              updateSeed(e.target.value, "step2Result", seed);
            }}
            value={seed.step2Result}
          />
        </Grid>

        <Grid item xs={1}>
          <Typography className="math-icon">&#215;</Typography>
        </Grid>

        <Grid item xs={2}>
          <NumberTextField
            label={matchesMd ? "" : "Management Impact on Mix"}
            disabled
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

        <Grid container p={"10px"} xs={12}>
          <Grid item xs={4}>
            <Typography className="math-icon">=</Typography>
          </Grid>

          <Grid item xs={7}>
            <NumberTextField
              label={matchesMd ? "" : "Mix Seeding Rate PLS"}
              disabled
              value={seed.step3Result}
            />
          </Grid>
        </Grid>

        <Grid item xs={1}></Grid>
      </>

      {/* Step 4: */}
      <>
        <Grid item xs={12}>
          <Typography className="step-header">Step 4: </Typography>
        </Grid>
        {renderStepsForm("Mix Seeding Rate PLS", "% Germination", "% Purity")}
        <Grid item xs={3}>
          <NumberTextField
            label={matchesMd ? "" : "Mix Seeding Rate PLS"}
            disabled
            value={seed.step3Result}
          />
          <Typography>Lbs / Acre</Typography>
        </Grid>

        <Grid item xs={1}>
          <Typography className="math-icon">÷</Typography>
        </Grid>

        <Grid item xs={3}>
          <NumberTextField
            label={matchesMd ? "" : "% Germination"}
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
            label={matchesMd ? "" : "% Purity"}
            handleChange={(e) => {
              updateSeed(
                convertToDecimal(e.target.value),
                "purityPercentage",
                seed
              );
            }}
            value={convertToPercent(seed.purityPercentage)}
          />
          <Typography>Lbs / Acre</Typography>
        </Grid>

        <Grid container p={"10px"} xs={12}>
          <Grid item xs={4}>
            <Typography className="math-icon">=</Typography>
          </Grid>

          <Grid item xs={7}>
            <NumberTextField
              label={matchesMd ? "" : "Bulk Seeding Rate"}
              disabled
              value={seed.bulkSeedingRate}
            />
          </Grid>

          <Grid item xs={1}></Grid>
        </Grid>
      </>

      {/* Step 5: */}
      <>
        <Grid item xs={12}>
          <Typography className="step-header">Step 5: </Typography>
        </Grid>
        {renderStepsForm("Bulk Seeding Rate", "Acres", "Pounds for Purchase")}
        <Grid item xs={3}>
          <NumberTextField
            label={matchesMd ? "" : "Bulk Seeding Rate"}
            disabled
            value={seed.bulkSeedingRate}
          />
          <Typography>Lbs / Acre</Typography>
        </Grid>

        <Grid item xs={1}>
          <Typography className="math-icon">&#215;</Typography>
        </Grid>

        <Grid item xs={3}>
          <NumberTextField
            label={matchesMd ? "" : "Acres"}
            disabled
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
            label={matchesMd ? "" : "Pounds for Purchase"}
            disabled
            value={seed.poundsForPurchase}
          />
          <Typography>Lbs / Acre</Typography>
        </Grid>
      </>
    </Grid>
  );
};
export default ReviewMixSteps;
