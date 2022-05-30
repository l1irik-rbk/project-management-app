import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { findUser, getLogin } from '../../services/utils';
import { User } from '../../services/interfaces/users';
import { ProfileShow } from './ProfileShow/ProfileShow';
import { ProfileEdit } from './ProfileEdit/ProfileEdit';
import { Spinner } from '../../components/Spinner/Spinner';

export const Profile = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [typeForm, setTypeForm] = useState<'edit' | 'show'>('show');
  const login = getLogin();

  useEffect(() => {
    document.title = `${typeForm} ${t('profile.docTitle')} ${login} | KanbanBoar`;

    const users = async () => {
      if (login) setUser(await findUser(login));
    };
    users();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeForm]);

  return (
    <>
      {user ? (
        typeForm === 'show' ? (
          <ProfileShow user={user} handleSubmit={() => setTypeForm('edit')} />
        ) : (
          <ProfileEdit user={user} onChangeTypeForm={() => setTypeForm('show')} />
        )
      ) : (
        <Spinner />
      )}
    </>
  );
};
