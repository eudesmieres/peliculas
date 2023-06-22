import { Routes, Route } from 'react-router-dom';
import './App.css';
import Form from './components/Form/Form';
import Search from './components/Search/Search';
import Pelicula from './components/Pelicula/Pelicula';
import NavBar from './components/NavBar/NavBar';

function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/importarPeliculas" element={<Form />} />
        <Route exact path="/searchByName" element={<Search />} />
        <Route path="/" element={<Pelicula />} />
      </Routes>
    </div>
  );
}

export default App;
