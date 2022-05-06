import { Link } from 'react-router-dom';
import s from './Header.module.scss';
import g from './../../App.module.scss';

export const Header = () => {
  return (
    <header className={`${g.wrapper} ${s.header}`}>
      <Link className={s.logo__link} to="/">
        <div className={s.logo}>
          <p className={s.logo__icon}>🐗</p>
          <h1 className={g.font_logo}>KanbanBoar</h1>
        </div>
      </Link>

      <nav className={s.nav}>
        <Link to="/auth">
          <button className={`${g.button} ${g.drop_shadow}`}>Login / Sign up</button>
        </Link>
      </nav>
    </header>
  );
};
