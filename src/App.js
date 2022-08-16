import logo from './logo.svg';
import './App.css';
import FilterList from './features/filter/FilterList';
import AddFilterForm from './features/filter/AddFilterForm';
function App() {
  return (
    <div className="App">
      <AddFilterForm />
      <FilterList />
    </div>
  );
}

export default App;
