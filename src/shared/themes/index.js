import { createTheme } from "@mui/material/styles";

export const dstTheme = createTheme({
  palette: {
    primary: {
      main: "#4F5F30",
      light: "#FFFFF2",
      dark: "#eff1e0",
      text: "#4F5F30",
    },
  },
  breakpoints: {
    values: {
      xs: 280,
      sm: 600,
      md: 912,
      lg: 1200,
      xl: 1536,
    },
  },
  typography: {
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
      color: "#4F5F30",
      fontSize: "1.25rem",
      fontWeight: 800,
      lineHeight: "1.5rem",
      paddingTop: "0.75rem",
      paddingBottom: "0.75rem",
      backgroundColor: "rgba(79, 95, 48, 0.09)",
    },
    nrcsStandard: {
      fontSize: 20,
    },
  },
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: "stepper" },
          style: {
            textTransform: "none",
            padding: "0.5rem 0",
          },
        },
      ],
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          color: "#4F5F30",
        },
      },
    },
  },
});
