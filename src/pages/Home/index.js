import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { Fragment } from "react";
import { DSTButton } from "./../../components/Button";
import { Header } from "./../../components/Header";
import "./home.css";

const Home = () => {
  const [imgPath, setImgPath] = useState("./neccc-logo.png");
  useEffect(() => {}, []);

  return (
    <Fragment>
      <Grid container spacing={2}>
        <Header
          className="header-container"
          headerVariant="dstHeaderHome"
          text="Seeding Rate Calculator"
          size={12}
          style={{ mt: 5 }}
        />
        <Grid xs={12} className="dst-neccc-logo">
          <img alt="neccc" src={imgPath} />
        </Grid>
        <DSTButton
          text="Start a new calculation"
          buttonClass="dst-button"
          size={12}
          theme="dstTheme"
          path={{ type: "local", url: "/calculator" }}
        />
        <DSTButton
          className="import-button"
          text="Import previous calculation"
          buttonClass="dst-import-button"
          size={12}
          theme="dstTheme"
          path={{ type: "local", url: "/calculator" }}
        />
      </Grid>
    </Fragment>
  );
};

export default Home;
