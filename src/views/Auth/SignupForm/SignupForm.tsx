import { useForm } from 'react-hook-form';

import s from './../Auth.module.scss';
import g from './../../../App.module.scss';
import { signup } from '../../../services/auth';
import { useTranslation } from 'react-i18next';
import { showError, showSuccess } from '../../../components/ToasterMessage/ToasterMessage';

type FormData = {
  name: string;
  login: string;
  password: string;
};

export const SignupForm = () => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const registerHandler = async (data: FormData) => {
    const { name, login, password } = data;
    const response = await signup(name, login, password);

    if (response.hasOwnProperty('statusCode')) {
      showError('toasterNotifications.auth.errors.signup');
    } else showSuccess('toasterNotifications.auth.success.signup');
  };

  return (
    <>
      <form className={s.form} onSubmit={handleSubmit(registerHandler)}>
        <label className={s.label}>
          <input
            className={s.input}
            {...register('name', { required: true, minLength: 3 })}
            type="text"
            placeholder={t('auth.name')}
          />

          {errors.name && (
            <span className={g.font_error}>
              {errors.name.type === 'required' && t('errors.errorsName.required')}
              {errors.name.type === 'minLength' && t('errors.errorsName.minLength')}
            </span>
          )}
        </label>

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

        <button className={`${g.button} ${s.button}`}>{t('auth.register')}</button>
      </form>
    </>
  );
};
