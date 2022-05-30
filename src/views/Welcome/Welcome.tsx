import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import s from './Welcome.module.scss';
import boar from '../../assets/images/boar.png';
import { useAppSelector } from '../../Redux/hooks';
import { useTranslation } from 'react-i18next';

export const Welcome = () => {
  const { isTokenLoaded } = useAppSelector((state) => state.auth);
  const { t } = useTranslation();

  useEffect(() => {
    document.title = `${t('welcom.docTitle')} | KanbanBoar`;
  });

  if (isTokenLoaded) return <Navigate to="/main" />;

  return (
    <>
      <div className={s.content}>
        <p className={s.content_text}>{t('welcom.text')}</p>
      </div>
      <img className={s.boar} src={boar} alt="boar" />
    </>
  );
};
