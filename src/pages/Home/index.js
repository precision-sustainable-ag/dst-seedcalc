
import { useEffect } from "react";
import { Link } from "react-router-dom"; 
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid"; 
import { ThemeProvider, createTheme } from "@mui/material/styles";
import './home.css';


const dstTheme = createTheme({
    palette: {
        primary: {
            main: '#4F5F30'
        },
        text: {
            primary: '#FFFFFF'
        }
    }
  });
  const dstTheme2 = createTheme({
    palette: {
        primary: {
            main: '#FFFFFF'
        },
        text: {
            primary: '#4F5F30'
        }
    }
  });
const Home = () => {

    useEffect(() => {}, [])
      
    return (
        <div className="home-container">        
            <Grid container spacing={2}>
                <Grid 
                    p 
                    xs={12}
                    className="dst-header"
                    >
                    <p>Seeding Rate Calculator</p>
                </Grid>            
                <Grid 
                    xs={12}
                    className="dst-neccc-logo">
                    <img src="./neccc-logo.png"/>
                </Grid>
                <Grid xs={12}>
                    <Button 
                        className="dst-button"
                        variant="contained"
                        theme={dstTheme}
                    ><Link
                        to={'filter'}>Start a new calculation</Link></Button>
                </Grid>
                <Grid xs={12} className="dst-import-button">
                    <Button 
                        variant="contained"
                        theme={dstTheme2}
                    ><span>Import previous calculation</span></Button>                     
                </Grid>    
            </Grid>
        </div>
    )
}

export default Home;