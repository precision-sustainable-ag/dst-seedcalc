import logo from './logo.svg';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import AddFilterForm from './features/filter/AddFilterForm';
import Results from './pages/Results';
import Home from './pages/Home';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="filter" element={<AddFilterForm/>} />
          <Route path="results" element={<Results />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
