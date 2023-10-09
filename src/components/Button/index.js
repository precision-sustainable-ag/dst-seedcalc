import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
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
      handleClick: Logic when user clicks on button
  }
}
*/
export const DSTButton = ({
  text,
  buttonClass,
  size,
  theme,
  path,
  handleClick,
}) => {
  return (
    <Grid xs={size} className={buttonClass} item>
      <Button
        variant="contained"
        theme={dstTheme}
        {...(handleClick && { onClick: handleClick })}
      >
        {path ? (
          <Link to={path.url}>{text}</Link>
        ) : (
          <Typography>{text}</Typography>
        )}
      </Button>
    </Grid>
  );
};
