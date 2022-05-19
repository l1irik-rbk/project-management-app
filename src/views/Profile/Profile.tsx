import { useEffect, useState } from 'react';

import { findUser, getLogin } from '../../services/utils';
import { User } from '../../services/interfaces/users';
import { ProfileShow } from './ProfileShow/ProfileShow';
import { ProfileEdit } from './ProfileEdit/ProfileEdit';
import { Spinner } from '../../components/Spinner/Spinner';

export const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [typeForm, setTypeForm] = useState<'edit' | 'show'>('show');

  useEffect(() => {
    document.title = `${typeForm} profile ${user?.login} | KanbanBoar`;

    const users = async () => {
      const login = getLogin();
      if (login) setUser(await findUser(login));
    };
    users();
  }, [typeForm, user]);

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
