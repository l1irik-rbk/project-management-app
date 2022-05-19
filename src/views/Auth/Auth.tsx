import { useEffect } from 'react';

import s from './Auth.module.scss';
import { Toggle } from './Toggle/Toggle';
import { LoginForm } from './LoginForm/LoginForm';
import { SignupForm } from './SignupForm/SignupForm';

export const Auth = () => {
  useEffect(() => {
    document.title = 'Auth | KanbanBoar';
  }, []);

  return (
    <div className={s.content}>
      <Toggle one={<LoginForm />} two={<SignupForm />} />
    </div>
  );
};
