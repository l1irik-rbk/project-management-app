import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import g from './../../../App.module.scss';

type Props = {
  one: React.ReactNode;
  two: React.ReactNode;
};

export const Toggle = (props: Props) => {
  const { t } = useTranslation();
  const [state, setState] = useState('one');

  const handleClickOne = () => {
    setState('one');
  };
  const handleClickTwo = () => {
    setState('two');
  };

  return (
    <>
      <div className={`${g.toggle} ${g.drop_shadow} ${g.button}`}>
        <button
          onClick={handleClickOne}
          className={`${g.button} ${g.one} ${state === 'one' && g.active}`}
        >
          {t('auth.login')}
        </button>
        <button
          onClick={handleClickTwo}
          className={`${g.button} ${g.two}  ${state === 'two' && g.active}`}
        >
          {t('auth.signUp')}
        </button>
      </div>

      {state === 'one' ? props.one : props.two}
    </>
  );
};
