import { useTranslation } from 'react-i18next';
import s from './ErrorMessage.module.scss';

export const ErrorMessage = () => {
  const { t } = useTranslation();

  return <h2 className={s.error_message}>{t('errorMessage.text')}</h2>;
};
