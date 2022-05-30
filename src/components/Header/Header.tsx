import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollMenu } from 'react-horizontal-scrolling-menu';

import s from './Header.module.scss';
import g from './../../App.module.scss';
import { useAppDispatch, useAppSelector } from '../../Redux/hooks';
import { logoutUserThunk } from '../../Redux/slices/userSlice';
import { boardsSlice, fetchBoardsThunk } from '../../Redux/slices/boardsSlice';
import i18n from '../../languagesInit';
import { getLanguage } from '../../services/utils';

export const Header = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const board = useAppSelector((state) => state.board.board);
  const isBoardLoaded = useAppSelector((state) => state.board.isBoardLoaded);
  const { isTokenLoaded } = useAppSelector((state) => state.user);
  const { setIsOpenModalCreateNewBoard } = boardsSlice.actions;
  const currentLang = getLanguage();
  const navigate = useNavigate();
  const redirectRedux = useAppSelector((state) => state.user.redirect);

  useEffect(() => {
    if (redirectRedux) navigate(redirectRedux);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [redirectRedux]);

  const [sticky, setSticky] = useState(false);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const handlelogout = () => {
    dispatch(logoutUserThunk());
  };

  const createNewBoard = async () => {
    dispatch(setIsOpenModalCreateNewBoard(true));
  };

  const changeSticky = () => {
    if (window.scrollY) setSticky(true);
    else setSticky(false);
  };

  window.addEventListener('scroll', changeSticky);

  return (
    <header className={`${s.header} ${sticky && s.sticky_active} ${sticky && g.drop_shadow}`}>
      <div className={`${g.wrapper} ${s.header}`}>
        <ScrollMenu scrollContainerClassName={s.header} separatorClassName={s.separator_menu}>
          <Link className={s.logo__link} to="/">
            <div className={s.logo}>
              {location.pathname.includes('kanban') && board ? (
                <>
                  <p className={s.logo__icon}>🐗</p>
                  <h1 className={g.font_logo}>{isBoardLoaded ? board.title : '🐗🐗🐗🐗🐗🐗'}</h1>
                </>
              ) : (
                <>
                  <p className={`${s.logo__icon} ${sticky && s.logo__rotate}`}>🐗</p>
                  <h1 className={g.font_logo}>{'KanbanBoar'}</h1>
                </>
              )}
            </div>
          </Link>

          <nav className={s.nav}>
            {isTokenLoaded && (
              <>
                {location.pathname !== '/main' && (
                  <Link to="/main">
                    <button className={`${g.button} ${g.drop_shadow}`}>{t('header.boards')}</button>
                  </Link>
                )}

                {location.pathname === '/main' && (
                  <button
                    className={`${g.button} ${g.drop_shadow} ${s.create_button}`}
                    onClick={createNewBoard}
                  >
                    {t('header.create')}
                  </button>
                )}
              </>
            )}

            <div className={`${g.toggle} ${g.drop_shadow} ${g.button}`}>
              <button
                className={`${g.button} ${g.one} ${currentLang === 'ru' && g.active}`}
                onClick={() => changeLanguage('ru')}
              >
                RU
              </button>
              <button
                className={`${g.button} ${g.two} ${currentLang === 'en' && g.active}`}
                onClick={() => changeLanguage('en')}
              >
                EN
              </button>
            </div>

            {!isTokenLoaded ? (
              <Link to="/auth">
                <button className={`${g.button} ${g.drop_shadow} ${s.login_button}`}>
                  {t('header.login')}
                </button>
              </Link>
            ) : (
              <div className={s.profile}>
                <Link to="/profile">
                  <button className={`${g.button} ${g.drop_shadow} ${s.avatar}`}></button>
                </Link>
                <button className={`${g.button} ${g.drop_shadow}`} onClick={handlelogout}>
                  {t('header.logout')}
                </button>
              </div>
            )}
            <button onClick={() => dispatch(fetchBoardsThunk())}>test</button>
          </nav>
        </ScrollMenu>
      </div>
    </header>
  );
};
