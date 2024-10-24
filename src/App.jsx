import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Grid } from '@mui/material';
import Header from './components/Header';
import Auth0ProviderWithNavigate from './components/Auth/Auth0ProviderWithNavigate';
import Calculator from './pages/Calculator';
import Feedback from './pages/Feedback';
import dstTheme from './shared/themes';
import About from './pages/About';
// eslint-disable-next-line import/no-extraneous-dependencies
import '@fontsource/ibm-plex-sans';

const App = () => (
  <ThemeProvider theme={dstTheme}>
    <div
      className="App"
      style={{
        textAlign: 'center',
        backgroundColor: '#fffff2',
        minHeight: '100vh',
        overflowX: 'hidden',
      }}
    >
      <BrowserRouter>
        <Auth0ProviderWithNavigate>
          <Grid container justifyContent="center">
            <Grid item xs={12} lg={8}>
              <Header />
              <Routes>
                <Route path="/" element={<Calculator />} />
                <Route path="/about" element={<About />} />
                <Route path="/feedback" element={<Feedback />} />
              </Routes>
            </Grid>
          </Grid>
        </Auth0ProviderWithNavigate>
      </BrowserRouter>
    </div>
  </ThemeProvider>
);

export default App;
