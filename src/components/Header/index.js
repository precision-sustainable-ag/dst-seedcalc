import Grid from "@mui/material/Grid"; 
import './header.css';

export const Header = ({text, headerClass, size}) => {
    return (
        <Grid 
            p 
            xs={size}
            className={headerClass}>
            <p>{text}</p>
        </Grid>     
    )
}