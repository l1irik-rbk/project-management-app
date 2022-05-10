import { useEffect, useState } from 'react';

import { getLogin } from '../../services/utils';
import { findUser } from '../../services/users';
import { User } from '../../services/interfaces/users';
import { ProfileShow } from './ProfileShow/ProfileShow';
import { ProfileEdit } from './ProfileEdit/ProfileEdit';

export const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [typeForm, setTypeForm] = useState<'edit' | 'show'>('show');

  useEffect(() => {
    const users = async () => {
      const login = getLogin();
      if (typeof login === 'string') setUser(await findUser(login));
    };
    users();
  }, [typeForm]);

  return (
    <>
      {user &&
        (typeForm === 'show' ? (
          <ProfileShow user={user} handleSubmit={() => setTypeForm('edit')} />
        ) : (
          <ProfileEdit user={user} onChangeTypeForm={() => setTypeForm('show')} />
        ))}
    </>
  );
};
