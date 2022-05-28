import { User } from '../../../services/interfaces/users';
import s from './../Profile.module.scss';
import g from './../../../App.module.scss';
import { useTranslation } from 'react-i18next';

type Props = {
  user: User;
  handleSubmit: () => void;
};

export const ProfileShow = (props: Props) => {
  const { t } = useTranslation();
  const { user, handleSubmit } = props;

  return (
    <>
      <div className={s.content}>
        <div className={s.row}>
          <p>{t('profile.name')}:</p>
          <p>{user.name}</p>
        </div>

        <div className={s.row}>
          <p>{t('profile.login')}:</p>
          <p>{user.login}</p>
        </div>

        <button onClick={handleSubmit} className={`${g.button} ${g.drop_shadow}`}>
          {t('profile.change')}
        </button>
      </div>
    </>
  );
};
