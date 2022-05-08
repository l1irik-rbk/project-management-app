import { SyntheticEvent, useEffect, useRef } from 'react';

import { signin, signup } from '../../services/auth';
import s from './Auth.module.scss';
import g from '../../App.module.scss';
import { Toggle } from './Toggle/Toggle';
import { appSlice } from '../../Redux/toolkitSlice';
import { apiUrl } from '../../services/utils';
import { useAppDispatch } from '../../Redux/reduxHooks';
import { useNavigate } from 'react-router-dom';

export const Auth = () => {
  const loginLogin = useRef(null);
  const loginPassword = useRef(null);
  const registerName = useRef(null);
  const registerLogin = useRef(null);
  const registerPassword = useRef(null);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { setToken, setTokenLoaded } = appSlice.actions;

  useEffect(() => {
    document.title = 'Auth';
  }, []);

  const loginHandler = async (e: SyntheticEvent) => {
    e.preventDefault();
    const login = loginLogin?.current ? (loginLogin.current as HTMLInputElement).value : '';
    const password = loginPassword?.current
      ? (loginPassword.current as HTMLInputElement).value
      : '';

    if (login && password) {
      const token = await signin(login, password);
      if (typeof token === 'string') {
        dispatch(setToken(token));
        dispatch(setTokenLoaded(true));
        navigate('/main');
      }
    } else alert('Please fill in all fields in Login');
  };

  const registerHandler = (e: SyntheticEvent) => {
    e.preventDefault();

    const name = registerName?.current ? (registerName.current as HTMLInputElement).value : '';
    const login = registerLogin?.current ? (registerLogin.current as HTMLInputElement).value : '';
    const password = registerPassword?.current
      ? (registerPassword.current as HTMLInputElement).value
      : '';

    if (name && login && password) signup(name, login, password);
    else alert('Please fill in all fields in Register');
  };

  return (
    <div className={s.content}>
      <Toggle
        one={
          <form className={s.form} onSubmit={loginHandler}>
            <input className={s.input} ref={loginLogin} type="text" placeholder="Login" />
            <input
              className={s.input}
              ref={loginPassword}
              type="password"
              placeholder="Password"
              autoComplete="on"
            />
            <button className={`${g.button} ${s.button}`}>Login</button>
          </form>
        }
        two={
          <form className={s.form} onSubmit={registerHandler}>
            <input className={s.input} ref={registerName} type="text" placeholder="Name" />
            <input className={s.input} ref={registerLogin} type="text" placeholder="Login" />
            <input
              className={s.input}
              ref={registerPassword}
              type="password"
              placeholder="Password"
              autoComplete="on"
            />
            <button className={`${g.button} ${s.button}`}>Register</button>
          </form>
        }
      />
    </div>
  );
};
