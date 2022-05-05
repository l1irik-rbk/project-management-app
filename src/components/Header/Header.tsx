import { Link } from 'react-router-dom';
import s from './Header.module.scss';
import g from './../../App.module.scss';

export const Header = () => {
  return (
    <header className={`${g.wrapper} ${s.header}`}>
      <h1>KanbanBoar</h1>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/auth">Auth</Link>
          </li>
          <li>
            <Link to="/404">404</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};
