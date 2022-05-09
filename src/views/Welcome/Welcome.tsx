import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import s from './Welcome.module.scss';
import boar from '../../assets/images/boar.png';
import { useAppSelector } from '../../Redux/reduxHooks';

export const Welcome = () => {
  const { isTokenLoaded } = useAppSelector((state) => state.appReducer);

  useEffect(() => {
    document.title = 'Welcome';
  });

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
