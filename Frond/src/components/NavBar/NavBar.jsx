import { Link } from 'react-router-dom';
import styles from './NavBar.module.css';


const NavBar = () => {
  return (
    <nav className={styles.NavBar}>
  <ul className={styles.NavList}>
    <li className={styles.NavItem}>
      <Link to="/">Peliculas</Link>
    </li>
    <li className={styles.NavItem}>
      <Link to="/searchByName">Buscador</Link>
    </li>
    <li className={styles.NavItem}>
      <Link to="/importarPeliculas">Agregar</Link>
    </li>
  </ul>
</nav>
  );
};

export default NavBar;
