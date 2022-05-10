import { User } from '../../../services/interfaces/users';
import s from './../Profile.module.scss';
import g from './../../../App.module.scss';

type Props = {
  user: User;
  handleSubmit: () => void;
};

export const ProfileShow = (props: Props) => {
  const { user, handleSubmit } = props;

  return (
    <>
      <div className={s.content}>
        <div className={s.row}>
          <p>Name:</p>
          <p>{user.name}</p>
        </div>

        <div className={s.row}>
          <p>Login:</p>
          <p>{user.login}</p>
        </div>

        <button onClick={handleSubmit} className={`${g.button} ${g.drop_shadow}`}>
          Change
        </button>
      </div>
    </>
  );
};
