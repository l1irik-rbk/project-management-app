import { SyntheticEvent, useRef } from 'react';
import { signin, signup } from '../../services/auth';
import { getToken } from '../../services/utils';
import s from './Auth.module.css';

export const Auth = () => {
  const loginLogin = useRef(null);
  const loginPassword = useRef(null);

  const loginHandler = async (e: SyntheticEvent) => {
    e.preventDefault();
    const login = loginLogin?.current ? (loginLogin.current as HTMLInputElement).value : '';
    const password = loginPassword?.current
      ? (loginPassword.current as HTMLInputElement).value
      : '';

    if (login && password) console.log(await signin(login, password));
  };

  const registerName = useRef(null);
  const registerLogin = useRef(null);
  const registerPassword = useRef(null);
  const registerHandler = (e: SyntheticEvent) => {
    e.preventDefault();

    const name = registerName?.current ? (registerName.current as HTMLInputElement).value : '';
    const login = registerLogin?.current ? (registerLogin.current as HTMLInputElement).value : '';
    const password = registerPassword?.current
      ? (registerPassword.current as HTMLInputElement).value
      : '';

    console.log(getToken());

    if (name && login && password) console.log(signup(name, login, password));
  };

  return (
    <>
      <hr />
      <form onSubmit={loginHandler}>
        <h2>Login</h2>
        <input ref={loginLogin} type="text" placeholder="Login" />
        <br />
        <input ref={loginPassword} type="password" placeholder="Password" autoComplete="on" />
        <br />
        <button>Login</button>
      </form>
      <hr />
      <form onSubmit={registerHandler}>
        <h2>Register</h2>
        <input ref={registerName} type="text" placeholder="Name" />
        <br />
        <input ref={registerLogin} type="text" placeholder="Login" />
        <br />
        <input ref={registerPassword} type="password" placeholder="Password" autoComplete="on" />
        <br />
        <button>Register</button>
      </form>
    </>
  );
};
