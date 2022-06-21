import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import s from './../Auth.module.scss';
import g from './../../../App.module.scss';
import { useAppDispatch } from '../../../Redux/hooks';
import { loginUserThunk } from '../../../Redux/slices/userSlice';

type FormData = {
  login: string;
  password: string;
};

export const LoginForm = () => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const dispatch = useAppDispatch();

  const loginHandler = async (data: FormData) => {
    const { login, password } = data;
    dispatch(loginUserThunk(login, password));
  };

  return (
    <>
      <form className={s.form} onSubmit={handleSubmit(loginHandler)}>
        <label className={s.label}>
          <input
            className={s.input}
            {...register('login', { required: true, minLength: 3, pattern: /^[a-zA-Z0-9]+$/ })}
            type="text"
            placeholder={t('auth.login')}
          />

          {errors.login && (
            <span className={g.font_error}>
              {errors.login.type === 'required' && t('errors.errorsLogin.required')}
              {errors.login.type === 'minLength' && t('errors.errorsLogin.minLength')}
              {errors.login.type === 'pattern' && t('errors.errorsLogin.pattern')}
            </span>
          )}
        </label>

        <label className={s.label}>
          <input
            className={s.input}
            {...register('password', { required: true, minLength: 8 })}
            type="password"
            placeholder={t('auth.password')}
            autoComplete="on"
          />

          {errors.password && (
            <span className={g.font_error}>
              {errors.password.type === 'required' && t('errors.errorsPassword.required')}
              {errors.password.type === 'minLength' && t('errors.errorsPassword.minLength')}
            </span>
          )}
        </label>

        <button className={`${g.button} ${s.button}`}>{t('auth.login')}</button>
      </form>
    </>
  );
};
