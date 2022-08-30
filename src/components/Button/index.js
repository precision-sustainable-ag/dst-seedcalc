import Grid from "@mui/material/Grid"; 
import Button from "@mui/material/Button";
import { dstTheme, dstTheme2 } from "../../shared/themes";

/* 

text: Button text
buttonClass: Class of button
size: Size of the Grid container
theme: Theme of the button
path: Formatted as {type: 'url/local', path: 'example', url: 'www.example.com'}
    type: specify whether this is a URL or local path
    path: local path
    url: URL string
*/
export const DSTButton = ({text, buttonClass, size, theme, path}) => {
    let themeType = theme === 'dstTheme' ? dstTheme : dstTheme2;
    return (
        <Grid xs={size} className={buttonClass}>
            <Button 
                variant="contained"
                theme={dstTheme2}
            ><Link
            to={path}>{text}</Link></Button>                     
        </Grid>    
    )
}