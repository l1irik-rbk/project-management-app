import { useEffect } from 'react';

import s from './Welcome.module.scss';
import boar from '../../assets/images/boar.png';

export const Welcome = () => {
  useEffect(() => {
    document.title = 'Welcome';
  }, []);

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
