import logo from "./logo.svg";
import { Fragment } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Calculator from "./pages/Calculator";
import Results from "./pages/Results";
import Home from "./pages/Home";
import { ThemeProvider } from "@emotion/react";
import { dstTheme } from "./shared/themes";
function App() {
  return (
    <ThemeProvider theme={dstTheme}>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="calculator" element={<Calculator />} />
            <Route path="results" element={<Results />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
