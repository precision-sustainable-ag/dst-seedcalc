import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import {
  BrowserRouter, Routes, Route,
} from 'react-router-dom';
import { Box, CssBaseline, Grid } from '@mui/material';
import { PSAProfile, PSASkipContent } from 'shared-react-components/src';
import { Provider } from 'react-redux';
import store from './store';

import Header from './components/Header';
import Auth0ProviderWithNavigate from './components/Auth/Auth0ProviderWithNavigate';
import Calculator from './pages/Calculator';
import dstTheme from './shared/themes';
import About from './pages/About/About';
import Feedback from './pages/Feedback/Feedback';
// eslint-disable-next-line import/no-extraneous-dependencies
import '@fontsource/ibm-plex-sans';
import BackButton from './components/BackButton';
import useIsMobile from './shared/hooks/useIsMobile';

const App = () => {
  // initially set calculator here
  const [calculator, setCalculator] = useState(null);
  const isNotFullScreen = useIsMobile('lg');

  return (
    <BrowserRouter>
      <Provider store={store}>
        <ThemeProvider theme={dstTheme}>
          <CssBaseline />
          <Auth0ProviderWithNavigate>
            <div
              className="App"
              style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                overflowX: 'hidden',
                textAlign: 'center',
              }}
            >
              <PSASkipContent href="#main-content" text="Skip to main content" />
              <Grid container sx={{ backgroundColor: 'white', justifyContent: 'center' }}>
                <Grid item xs={12} lg={10}>
                  <Header />
                </Grid>
              </Grid>
              <Grid
                container
                sx={{
                  backgroundColor: 'main.background1',
                  justifyContent: 'center',
                }}
              >
                <Grid
                  item
                  xs={12}
                  lg={10}
                  sx={{
                    backgroundColor: 'white',
                    margin: isNotFullScreen ? 0 : '30px 0',
                    borderRadius: isNotFullScreen ? 0 : '25px',
                    boxShadow: isNotFullScreen ? 'none' : '0 2px 20px 0 rgba(0, 0, 0, 0.10)',
                  }}
                >
                  <Box id="main-content">
                    <Routes>
                      <Route path="/" element={<Calculator calculator={calculator} setCalculator={setCalculator} />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/feedback" element={<Feedback />} />
                      <Route path="/profile" element={<PSAProfile />} />
                    </Routes>
                  </Box>
                  <BackButton />
                </Grid>
              </Grid>
              <Grid container sx={{ flex: 1, backgroundColor: 'main.background1' }} />
            </div>
          </Auth0ProviderWithNavigate>
        </ThemeProvider>
      </Provider>
    </BrowserRouter>
  );
};

window.addEventListener('error', (err) => {
  if (!/^https:/.test(window.location.href)) return;

  const requestPayload = {
    repository: 'dst-feedback',
    title: 'CRASH',
    name: 'error',
    email: 'error@error.com',
    comments: `${err?.message}: ${err?.filename}`,
    labels: ['crash', 'dst-seedcalc'],
  };

  /* eslint-disable no-alert */
  fetch('https://feedback.covercrop-data.org/v1/issues', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestPayload),
  })
    .then((response) => response.json())
    .then((body) => {
      if (body?.data?.status === 'success') {
        alert(`
          An error occurred.
          We have been notified and will investigate the problem.
        `);
      } else {
        alert('An error occurred');
      }
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error);
      alert('Failed to send Feedback to Github.');
    });
}, { once: true });
/* eslint-enable no-alert */

// expose store when run in Cypress
if (window.Cypress) {
  window.store = store;
}

export default App;
