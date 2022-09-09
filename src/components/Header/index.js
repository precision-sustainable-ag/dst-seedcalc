import Grid from "@mui/material/Grid";
import "./header.css";

/* 
{
    name: Header,
    description: Re-usable header component,
    params: {
        text: Header text,
        headerClass: Class of header,
        size: Size of the Header,
    }
}
*/
export const Header = ({ text, headerClass, size }) => {
  return (
    <Grid p xs={size} className={headerClass}>
      <p>{text}</p>
    </Grid>
  );
};
