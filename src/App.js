import logo from "./logo.svg";
import { Fragment } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";

import "./App.css";
import Calculator from "./pages/Calculator";
import Results from "./pages/Results";
import Home from "./pages/Home";
import { dstTheme } from "./shared/themes";
import { DSTModal } from "./components/DSTModal";
import { clearModal } from "./features/stepSlice/index";
function App() {
  const dispatch = useDispatch();
  const modalState = useSelector((state) => state.steps.value.modal);
  const handleModal = () => {
    modalState.error ? window.location.reload(false) : clearModal();
  };

  return (
    <ThemeProvider theme={dstTheme}>
      <div className="App">
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
            {/* <Route path="calculator" element={<Calculator />} /> */}
            <Route path="results" element={<Results />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
