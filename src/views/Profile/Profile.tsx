import { useEffect, useState } from 'react';

import { findUser, getLogin } from '../../services/utils';
import { User } from '../../services/interfaces/users';
import { ProfileShow } from './ProfileShow/ProfileShow';
import { ProfileEdit } from './ProfileEdit/ProfileEdit';
import { Spinner } from '../../components/Spinner/Spinner';
import { useTranslation } from 'react-i18next';

export const Profile = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [typeForm, setTypeForm] = useState<'edit' | 'show'>('show');
  const login = getLogin();

  useEffect(() => {
    document.title = `${typeForm} ${t('profile.docTitle')} ${user?.login} | KanbanBoar`;
    console.log('asd');
    users();
  }, [typeForm]);

  const users = async () => {
    if (login) setUser(await findUser(login));
  };

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
