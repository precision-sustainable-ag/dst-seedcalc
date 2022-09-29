import logo from "./logo.svg";
import { Fragment } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Calculator from "./pages/Calculator";
import Results from "./pages/Results";
import Home from "./pages/Home";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="calculator" element={<Calculator />} />
          <Route path="results" element={<Results />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
