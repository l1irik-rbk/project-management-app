import { useEffect } from 'react';

import s from './Auth.module.scss';
import { Toggle } from './Toggle/Toggle';
import { LoginForm } from './LoginForm/LoginForm';
import { SignupForm } from './SignupForm/SignupForm';
import { useTranslation } from 'react-i18next';

export const Auth = () => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = `${t('auth.docTitle')} | KanbanBoar`;
  }, []);

  return (
    <div className={s.content}>
      <Toggle one={<LoginForm />} two={<SignupForm />} />
    </div>
  );
};
