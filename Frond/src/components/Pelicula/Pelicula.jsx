import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Pelicula.module.css';

const Pelicula = () => {
  const [id, setId] = useState('');
  const [description, setDescription] = useState('');
  const [premiere, setPremiere] = useState('');
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    BuscarPelículas();
  }, []);

  const BuscarPelículas = async () => {
    try {
      const response = await axios.get('http://localhost:3001/peliculas');
      setMovies(response.data);
    } catch (error) {
      console.error('Error en la busqueda de pelicula:', error);
    }
  };

  const handleAddMovie = async () => {
    try {
      const newMovie = { id, description, premiere };
      const response = await axios.post('http://localhost:3001/peliculas', newMovie);
      console.log(response.data.message);
      BuscarPelículas();
    } catch (error) {
      console.error('Error al añadir pelicula :', error);
    }
  };

  const handleEditMovie = async (movie) => {
    try {
      const { id, description, premiere } = movie;
      const updatedMovie = { id, description, premiere };
      const response = await axios.put('http://localhost:3001/peliculas', updatedMovie);
      console.log(response.data);
      BuscarPelículas();
    } catch (error) {
      console.error('Error al editar pelicula:', error);
    }
  };

  const handleDeleteMovie = async (id) => {
    try {
      const response = await axios.delete('http://localhost:3001/peliculas', { data: { id } });
      console.log(response.data);
      BuscarPelículas();
    } catch (error) {
      console.error('Error al eliminar pelicula:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Agregar Película</h2>
      <input type="text" placeholder="Título" value={id} onChange={(e) => setId(e.target.value)} />
      <input type="text" placeholder="Descripción" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input type="text" placeholder="Año de estreno" value={premiere} onChange={(e) => setPremiere(e.target.value)} />
      <button className={styles.button} onClick={handleAddMovie}>Agregar</button>

      <h2>Películas</h2>
      {movies.map((movie) => (
        <div key={movie.id} className={styles.movie}>
          <span className={styles.title}>Título: {movie.id}</span>
          <span>Descripción: {movie.description}</span>
          <span>Año: {movie.premiere}</span>
          <button className={styles.editButton} onClick={() => handleEditMovie(movie)}>Editar</button>
          <button className={styles.deleteButton} onClick={() => handleDeleteMovie(movie.id)}>Eliminar</button>
        </div>
      ))}
    </div>
  );
};

export default Pelicula;
