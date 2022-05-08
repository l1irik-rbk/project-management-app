import { useEffect } from 'react';

import s from './Welcome.module.scss';
import boar from '../../assets/images/boar.png';
import { useAppDispatch, useAppSelector } from '../../Redux/reduxHooks';
import { Navigate } from 'react-router-dom';
import { appSlice } from '../../Redux/toolkitSlice';

export const Welcome = () => {
  const dispatch = useAppDispatch();
  const { setToken, setTokenLoaded } = appSlice.actions;
  const { isTokenLoaded } = useAppSelector((state) => state.appReducer);

  useEffect(() => {
    document.title = 'Welcome';
    const token = document.cookie.split('=')[1];
    dispatch(setToken(token));
    if (token) dispatch(setTokenLoaded(true));
  }, []);

  if (isTokenLoaded) return <Navigate to="/main" />;

  return (
    <div className={s.content}>
      <p>
        Это приложение поможет организовать групповую работу в стиле канбан. Попробуй, ещё захочешь
        <br />
        <br />
        Разработано командой из трёх мужиков на курсе React от rs.school
      </p>
      <img className={s.boar} src={boar} alt="" />
      {/* <div className={s.boar}></div> */}
    </div>
  );
};
