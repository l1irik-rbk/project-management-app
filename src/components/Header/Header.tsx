import { Link } from 'react-router-dom';
import s from './Header.module.scss';

export const Header = () => {
  return (
    <header>
      Header
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/auth">About</Link>
          </li>
          <li>
            <Link to="/404">404</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};
