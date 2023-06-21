import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Search.module.css';

const Search = () => {
  const [movies, setMovies] = useState([]);
  const [foundMovie, setFoundMovie] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchMovies(currentPage);
  }, [currentPage, searchTerm]);

  const fetchMovies = async () => {
    try {
      const encodedId = encodeURIComponent(searchTerm); // Codificar el valor del parámetro id
      const url = `http://localhost:3001/search?id=${encodedId}&pagina=${currentPage}`;

      const response = await axios.get(url);
   
      const { peliculaEncontrada, peliculasPaginadas, paginaActual, totalPaginas } = response.data;

      if (response.status === 404) {
        // Película no encontrada
        setFoundMovie(null);
        setMovies(peliculasPaginadas);
        setCurrentPage(paginaActual);
        setTotalPages(totalPaginas);
        console.log('Error 404 pelicula no encontrada:', response.data);
        return;
      }

      setFoundMovie(peliculaEncontrada);
      setMovies(peliculasPaginadas);
      setCurrentPage(paginaActual);
      setTotalPages(totalPaginas);
    } catch (error) {
      console.error('Error en la Busqueda de pelicula:', error);
    }
  };

  const handleSearchChange = (event) => {
    event.preventDefault()
    setSearchTerm(event.target.value);
    setFoundMovie(null);
  };

  const handleSearch = () => {
    
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className={styles.container}>
      <h2>Listado de Películas</h2>
      <div className={styles.search}>
        <input
          type="text"
          placeholder="Buscar por título"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button onClick={handleSearch}>Buscar</button>
      </div>

      {foundMovie ? (
  <div className={styles.movieDetails}>
    <span>Título: {foundMovie.id}</span>
    <span>Descripción: {foundMovie.description}</span>
    <span>Año: {foundMovie.premiere}</span>
  </div>
) : (
  <ul className={styles.movieList}>
    <p>Pelicula no encontrada</p>
    {movies?.map((movie) => (
      <li key={movie.id} className={styles.movieItem}>
        <span>Título: {movie.id}</span>
        <span>Descripción: {movie.description}</span>
        <span>Año: {movie.premiere}</span>
      </li>
    ))}
  </ul>
)}


      {totalPages > 1 && (
        <div className={styles.pagination}>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={currentPage === page ? styles.activePage : ''}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
