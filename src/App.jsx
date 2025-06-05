import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import {
  BrowserRouter, Routes, Route,
} from 'react-router-dom';
import { Box, Grid } from '@mui/material';
import { PSAProfile, PSASkipContent } from 'shared-react-components/src';
import Header from './components/Header';
import Auth0ProviderWithNavigate from './components/Auth/Auth0ProviderWithNavigate';
import Calculator from './pages/Calculator';
import dstTheme from './shared/themes';
import About from './pages/About/About';
import Feedback from './pages/Feedback/Feedback';
// eslint-disable-next-line import/no-extraneous-dependencies
import '@fontsource/ibm-plex-sans';
import BackButton from './components/BackButton';

const App = () => {
  // initially set calculator here
  const [calculator, setCalculator] = useState(null);

  return (
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
                <PSASkipContent href="#main-content" text="Skip to main content" />
                <Header />
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
          </Auth0ProviderWithNavigate>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
};

window.addEventListener('error', (err) => {
  if (/(localhost|dev)/i.test(window.location)) return;

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

export default App;
