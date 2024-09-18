import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth0ProviderWithNavigate from './components/Auth/Auth0ProviderWithNavigate';
import Calculator from './pages/Calculator';
import Feedback from './pages/Feedback';
import dstTheme from './shared/themes';

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
          <Routes>
            <Route path="/" element={<Calculator />} />
            <Route path="/feedback" element={<Feedback />} />
          </Routes>
        </Auth0ProviderWithNavigate>
      </BrowserRouter>
    </div>
  </ThemeProvider>
);

export default App;
