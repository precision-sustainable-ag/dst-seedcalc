import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
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
// TODO: not used now
export const Header = ({ text, size, style, headerVariant }) => {
  return (
    <Grid p xs={size} sx={style}>
      <Typography variant={headerVariant}>{text}</Typography>
    </Grid>
  );
};
