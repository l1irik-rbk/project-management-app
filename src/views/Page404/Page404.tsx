import { useEffect } from 'react';
import s from './Page404.module.scss';

export const Page404 = () => {
  useEffect(() => {
    document.title = `Page not found | KanbanBoar`;
  }, []);

  return <div className={s.text}>404 bro</div>;
};
