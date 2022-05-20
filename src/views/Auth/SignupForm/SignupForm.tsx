import { useForm } from 'react-hook-form';

import s from './../Auth.module.scss';
import g from './../../../App.module.scss';
import { signup } from '../../../services/auth';

type FormData = {
  name: string;
  login: string;
  password: string;
};

export const SignupForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const registerHandler = async (data: FormData) => {
    const { name, login, password } = data;
    const response = await signup(name, login, password);
    if (response.hasOwnProperty('statusCode')) alert('Error');
  };

  return (
    <>
      <form className={s.form} onSubmit={handleSubmit(registerHandler)}>
        <label className={s.label}>
          <input
            className={s.input}
            {...register('name', { required: true, minLength: 3 })}
            type="text"
            placeholder="Name"
          />

          {errors.name && (
            <span className={g.font_error}>
              {errors.name.type === 'required' && 'Name is required'}
              {errors.name.type === 'minLength' && 'Name must be at least 3 characters'}
            </span>
          )}
        </label>

        <label className={s.label}>
          <input
            className={s.input}
            {...register('login', { required: true, minLength: 3, pattern: /^[a-zA-Z0-9]+$/ })}
            type="text"
            placeholder="Login"
          />

          {errors.login && (
            <span className={g.font_error}>
              {errors.login.type === 'required' && 'Login is required'}
              {errors.login.type === 'minLength' && 'Login must be at least 3 characters'}
              {errors.login.type === 'pattern' && 'Login must contain only letters and numbers'}
            </span>
          )}
        </label>

        <label className={s.label}>
          <input
            className={s.input}
            {...register('password', { required: true, minLength: 8 })}
            type="password"
            placeholder="Password"
            autoComplete="on"
          />

          {errors.password && (
            <span className={g.font_error}>
              {errors.password.type === 'required' && 'Password is required'}
              {errors.password.type === 'minLength' && 'Password must be at least 8 characters'}
            </span>
          )}
        </label>

        <button className={`${g.button} ${s.button}`}>Register</button>
      </form>
    </>
  );
};
