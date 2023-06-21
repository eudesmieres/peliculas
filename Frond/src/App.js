import { Routes, Route } from 'react-router-dom';
import './App.css';
import Form from './components/Form/Form';
import Search from './components/Search/Search';
import Pelicula from './components/Pelicula/Pelicula';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/importarPeliculas" element={<Form />} />
        <Route exact path="/searchByName" element={<Search />} />
        <Route path="/" element={<Pelicula />} />
      </Routes>
    </div>
  );
}

export default App;
