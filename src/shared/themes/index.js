import { createTheme } from "@mui/material/styles";

export const dstTheme = createTheme({
  palette: {
    primary: {
      main: "#4F5F30",
    },
  },
  typography: {
    dstHeader: {
      fontSize: 20,
      color: "#4f5f30",
      fontWeight: 800,
      lineHeight: "33.41px",
      textAlign: "center",
      textShadow: "0px 4px 4px rgba(0, 0, 0, 0.15)",
    },
    dstHeaderHome: {
      fontSize: 28,
      color: "#4f5f30",
      fontWeight: 800,
      lineHeight: "33.41px",
      textShadow: "0px 4px 4px rgba(0, 0, 0, 0.15)",
      textAlign: "center",
      marginTop: 100,
    },
    h2: {
      fontSize: 25,
      fontWeight: 500,
      marginTop: 25,
      marginBottom: 30,
    },
    nrcsStandard: {
      fontSize: 20,
    },
  },
});
