import Grid from "@mui/material/Grid"; 
import Button from "@mui/material/Button";
import { dstTheme, dstTheme2 } from "../../shared/themes";

export const DSTButton = ({text, buttonClass, type, size, theme}) => {
    let themeType = theme === 'dstTheme' ? dstTheme : dstTheme2;
    return (
        <Grid xs={size} className={buttonClass}>
            <Button 
                variant="contained"
                theme={dstTheme2}
            ><span>{text}</span></Button>                     
        </Grid>    
    )
}