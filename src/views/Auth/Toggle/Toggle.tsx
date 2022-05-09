import { useState } from 'react';

import s from './Toggle.module.scss';
import g from './../../../App.module.scss';

type Props = {
  one: React.ReactNode;
  two: React.ReactNode;
};

export const Toggle = (props: Props) => {
  const [state, setState] = useState('one');

  const handleClickOne = () => {
    setState('one');
  };
  const handleClickTwo = () => {
    setState('two');
  };

  return (
    <>
      <button className={`${s.toggle} ${g.drop_shadow} ${g.button}`}>
        <button
          onClick={handleClickOne}
          className={`${g.button} ${s.one} ${state === 'one' && s.active}`}
        >
          Login
        </button>
        <button
          onClick={handleClickTwo}
          className={`${g.button} ${s.two}  ${state === 'two' && s.active}`}
        >
          Sign Up
        </button>
      </button>

      {state === 'one' ? props.one : props.two}
    </>
  );
};
