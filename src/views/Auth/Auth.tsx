import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import s from './Auth.module.scss';
import { Toggle } from './Toggle/Toggle';
import { LoginForm } from './LoginForm/LoginForm';
import { SignupForm } from './SignupForm/SignupForm';

export const Auth = () => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = `${t('auth.docTitle')} | KanbanBoar`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={s.content}>
      <Toggle one={<LoginForm />} two={<SignupForm />} />
    </div>
  );
};
