import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import s from './Page404.module.scss';

export const Page404 = () => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = `${t('errorPage.docTitle')} | KanbanBoar`;
  }, []);

  return <div className={s.text}>{t('errorPage.text')}</div>;
};
