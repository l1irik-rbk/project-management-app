import s from './Profile.module.scss';
import g from './../../App.module.scss';
import { getLogin } from '../../services/utils';
import { useEffect, useState } from 'react';
import { findUser } from '../../services/users';
import { User } from '../../services/interfaces/users';
import { ClickChange } from './ClickChange/ClickChange';

export const Profile = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const users = async () => {
      const login = getLogin();
      if (typeof login === 'string') setUser(await findUser(login));
    };
    users();
  }, []);

  return (
    <>
      {user && (
        <div className={s.content}>
          <ClickChange
            one={<button className={`${g.button} ${g.font_title}`}>name: {user.name}</button>}
            two={<button>V</button>}
          />

          <ClickChange
            one={
              <button className={`${g.button} ${s.name} ${g.font_title}`}>
                login: {user.login}
              </button>
            }
            two={<button>V</button>}
          />
          <ClickChange
            one={
              <button className={`${g.button} ${s.name} ${g.font_title}`}>password: hide</button>
            }
            two={<button>V</button>}
          />
        </div>
      )}
    </>
  );
};
