import { Link, useLocation } from 'react-router-dom';
import s from './Header.module.scss';
import g from './../../App.module.scss';
import { useAppDispatch, useAppSelector } from '../../Redux/reduxHooks';
import { appSlice } from '../../Redux/toolkitSlice';

export const Header = () => {
  const { isTokenLoaded, boards } = useAppSelector((state) => state.appReducer);
  const { newBoard } = boards;
  const dispatch = useAppDispatch();
  const { setToken, setTokenLoaded, setNewBoard } = appSlice.actions;
  const location = useLocation();

  const logout = () => {
    document.cookie = `token=${''}`;
    dispatch(setToken(null));
    dispatch(setTokenLoaded(false));
  };

  const createNewBoard = async () => {
    dispatch(setNewBoard(!newBoard));
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
            {location.pathname !== '/main' && (
              <Link to="/main">
                <button className={`${g.button} ${g.drop_shadow}`}>Boards</button>
              </Link>
            )}

            {location.pathname === '/main' && (
              <button className={`${g.button} ${g.drop_shadow}`} onClick={createNewBoard}>
                Create new board
              </button>
            )}
          </>
        )}
        {!isTokenLoaded ? (
          <Link to="/auth">
            <button className={`${g.button} ${g.drop_shadow}`}>Login / Sign up</button>
          </Link>
        ) : (
          <div className={s.profile}>
            <Link to="/profile">
              <button className={`${g.button} ${g.drop_shadow} ${s.avatar}`}></button>
            </Link>
            <button className={`${g.button} ${g.drop_shadow}`} onClick={logout}>
              Logout
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};
