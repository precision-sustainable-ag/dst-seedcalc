import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { dstTheme } from "../../shared/themes";
import "./button.css";

/* 
{
  name: Button,
  description: Re-usable Button component,
  params: {
      text: Button text,
      buttonClass: Class of button,
      size: Size of the Grid container,
      theme: Theme of the button,
      path: Formatted as {type: 'url/local', url: 'www.example.com'}
          type: specify whether this is a URL or local path
          url: URL path
  }
}
*/
export const DSTButton = ({ text, buttonClass, size, theme, path }) => {
  return (
    <Grid xs={size} className={buttonClass}>
      <Button variant="contained" theme={dstTheme}>
        <Link to={path.url}>{text}</Link>
      </Button>
    </Grid>
  );
};
