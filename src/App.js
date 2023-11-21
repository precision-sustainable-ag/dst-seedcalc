import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';

import Calculator from './pages/Calculator';
import Results from './pages/Results';
import Home from './pages/Home';
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
      {/* TODO: modal not used now */}
      {/* <DSTModal
          isOpen={modalState.isOpen}
          setModal={handleModal}
          handleClose={handleModal}
          title={
            modalState.error ? modalState.errorTitle : modalState.successTitle
          }
          description={
            modalState.error
              ? modalState.errorMessage
              : modalState.successMessage
          }
          style={{}}
        /> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="results" element={<Results />} />
        </Routes>
      </BrowserRouter>
    </div>
  </ThemeProvider>
);

export default App;
