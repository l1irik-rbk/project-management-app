import { Link } from 'react-router-dom';
import s from './Header.module.scss';
import g from './../../App.module.scss';
import { useAppDispatch, useAppSelector } from '../../Redux/reduxHooks';
import { appSlice } from '../../Redux/toolkitSlice';
import { useEffect } from 'react';
import { getToken } from '../../services/utils';

export const Header = () => {
  const { isTokenLoaded } = useAppSelector((state) => state.appReducer);
  const dispatch = useAppDispatch();
  const { setToken, setTokenLoaded } = appSlice.actions;

  useEffect(() => {
    const token = getToken();
    dispatch(setToken(token));
    dispatch(setTokenLoaded(Boolean(token)));
  });

  const logout = () => {
    console.log('logout');
    document.cookie = `token=${''}`;
    dispatch(setToken(null));
    dispatch(setTokenLoaded(false));
  };

  return (
    <header className={`${g.wrapper} ${s.header}`}>
      <Link className={s.logo__link} to="/">
        <div className={s.logo}>
          <p className={s.logo__icon}>🐗</p>
          <h1 className={g.font_logo}>KanbanBoar</h1>
        </div>
      </Link>

      <nav className={s.nav}>
        {isTokenLoaded && (
          <>
            <Link to="/main">
              <button className={`${g.button} ${g.drop_shadow}`}>Boards</button>
            </Link>
            <button className={`${g.button} ${g.drop_shadow} ${s.btn}`}>Create new board</button>
          </>
        )}
        {!isTokenLoaded ? (
          <Link to="/auth">
            <button className={`${g.button} ${g.drop_shadow}`}>Login / Sign up</button>
          </Link>
        ) : (
          <button className={`${g.button} ${g.drop_shadow} ${s.btn}`} onClick={logout}>
            Logout
          </button>
        )}
      </nav>
    </header>
  );
};
