import { useForm } from 'react-hook-form';

import { User, UserError } from '../../../services/interfaces/users';
import s from './../Profile.module.scss';
import g from './../../../App.module.scss';
import { updateUser } from '../../../services/users';

type Props = {
  user: User;
  onChangeTypeForm: () => void;
};

export type FormData = {
  name: string;
  login: string;
  password: string;
};

export const ProfileEdit = (props: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const { user } = props;

  const onSubmit = async (data: FormData) => {
    const response = await updateUser(data, user.id);
    if (response.hasOwnProperty('statusCode')) {
      const error = response as UserError;
      alert(`${error.statusCode} ${error.message} ${error.error}`);
    } else {
      alert('Профиль обновлен');
      // console.log('>>>', response);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={s.content}>
        <div>
          <label className={s.row}>
            <p>Name:</p>
            <input
              className={`${g.input} ${s.input}`}
              type="text"
              {...register('name', { required: true, minLength: 3 })}
              defaultValue={user.name}
            />
          </label>

          {errors.name && (
            <span className={g.font_error}>
              {errors.name.type === 'required' && 'Name is required'}
              {errors.name.type === 'minLength' && 'Name must be at least 3 characters'}
            </span>
          )}
        </div>

        <div>
          <label className={s.row}>
            <p>Login:</p>
            <input
              className={`${g.input} ${s.input}`}
              type="text"
              {...register('login', { required: true, minLength: 3, pattern: /^[a-zA-Z0-9]+$/ })}
              defaultValue={user.login}
            />
          </label>

          {errors.login && (
            <span className={g.font_error}>
              {errors.login.type === 'required' && 'Login is required'}
              {errors.login.type === 'minLength' && 'Login must be at least 3 characters'}
              {errors.login.type === 'pattern' && 'Login must contain only letters and numbers'}
            </span>
          )}
        </div>

        <div>
          <label className={s.row}>
            <p>Password:</p>
            <input
              className={`${g.input} ${s.input}`}
              type="text"
              placeholder="your new password"
              {...register('password', { required: true, minLength: 8 })}
            />
          </label>

          {errors.password && (
            <span className={g.font_error}>
              {errors.password.type === 'required' && 'Password is required'}
              {errors.password.type === 'minLength' && 'Password must be at least 8 characters'}
            </span>
          )}
        </div>

        <button className={`${g.button} ${g.drop_shadow}`}>Update</button>
      </form>
    </>
  );
};
