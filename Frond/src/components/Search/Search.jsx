import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Search.module.css';

const Search = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchMovies();
  }, [currentPage, searchTerm]);

  const fetchMovies = async () => {
    try {
      const response = await axios.get('http://localhost:3001/peliculas', {
        params: {
          id: searchTerm,
          pagina: currentPage
        }
      });
      setMovies(response.data);
      setTotalPages(Math.ceil(response.headers['x-total-count'] / 3)); // Assuming 10 movies per page
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    setCurrentPage(1);
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

      <ul className={styles.movieList}>
        {movies.map((movie) => (
          <li key={movie.id} className={styles.movieItem}>
            <span>Título: {movie.id}</span>
            <span>Descripción: {movie.description}</span>
            <span>Año: {movie.premiere}</span>
          </li>
        ))}
      </ul>

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
