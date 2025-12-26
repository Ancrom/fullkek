import { NavLink } from "react-router-dom";
import styles from "./header.module.scss";

export default function Header() {
  return (
    <header>
      <nav className={styles.nav}>
        <span className={styles.logo}>fullkek</span>
        <ul className={styles.menu}>
          <li>
            <NavLink to="/users" className={styles.item}>
              Users
            </NavLink>
          </li>
          <li>
            <NavLink to="/users/create" className={styles.item}>
              Create user
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
