import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { DSTButton } from "./../../components/Button";
import { Header } from "./../../components/Header";
import "./home.css";

const Home = () => {
  const [imgPath, setImgPath] = useState("./neccc-logo.png");
  useEffect(() => {}, []);

  return (
    <div className="home-container">
      <Grid container spacing={2}>
        <Header
          type="home"
          headerClass="dst-header-home"
          text="Seeding Rate Calculator"
          size={12}
        />
        <Grid xs={12} className="dst-neccc-logo">
          <img alt="neccc" src={imgPath} />
        </Grid>
        <DSTButton
          text="Start a new calculation"
          buttonClass="dst-button"
          size={12}
          theme="dstTheme"
          path={{ type: "local", url: "/filter" }}
        />
        <DSTButton
          className="import-button"
          text="Import previous calculation"
          buttonClass="dst-import-button"
          size={12}
          theme="dstTheme2"
          path={{ type: "local", url: "/filter" }}
        />
      </Grid>
    </div>
  );
};

export default Home;
