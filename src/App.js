import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
import Auth0ProviderWithNavigate from './components/Auth/Auth0ProviderWithNavigate';

import Calculator from './pages/Calculator';
// import Home from './pages/Home';
import dstTheme from './shared/themes';
import Feedback from './pages/Feedback';

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
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/" element={<Calculator />} />
            <Route path="/feedback" element={<Feedback />} />
          </Routes>
        </Auth0ProviderWithNavigate>
      </BrowserRouter>
    </div>
  </ThemeProvider>
);

export default App;
