
import { useEffect } from "react";
import { Link } from "react-router-dom"; 
import Grid from "@mui/material/Grid"; 
import { DSTButton } from "./../../components/Button";
import { Header } from "./../../components/Header";
import './home.css';

const Home = () => {

    useEffect(() => {}, [])
      
    return (
        <div className="home-container">        
            <Grid container spacing={2}>
                <Header 
                    type="home"
                    headerClass="dst-header-home"
                    text="Seeding Rate Calculator"
                    size={12}
                />           
                <Grid 
                    xs={12}
                    className="dst-neccc-logo">
                    <img src="./neccc-logo.png"/>
                </Grid>
                <DSTButton 
                    text="Import previous calculation"
                    buttonClass="dst-button"
                    size={12}
                    theme="dstTheme"
                    path={type: 'local', path: 'filter', url: ''}
                />
                <Grid xs={12}>
                    
                    <Button 
                        className="dst-button"
                        variant="contained"
                        theme={dstTheme}
                    ><Link
                        to={'filter'}>Start a new calculation</Link></Button>
                </Grid>
                <DSTButton 
                    text="Import previous calculation"
                    buttonClass="dst-button-import"
                    size={12}
                    theme="dstTheme2"
                    path="results"
                />

            </Grid>
        </div>
    )
}

export default Home;