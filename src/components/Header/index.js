import Grid from "@mui/material/Grid";
import { Typography, createTheme, ThemeProvider } from "@mui/material";
import "./header.css";
/* 
{
    name: Header,
    description: Re-usable header component,
    params: {
        text: Header text,
        theme: theme,
        headerVariant: header variant
        size: Size of the Header,
        style: Additional style
    }
}
*/

export const Header = ({ text, size, style, theme, headerVariant }) => {
  return (
    <ThemeProvider theme={theme}>
      <Grid p xs={size} sx={style}>
        <Typography variant={headerVariant}>{text}</Typography>
      </Grid>
    </ThemeProvider>
  );
};
