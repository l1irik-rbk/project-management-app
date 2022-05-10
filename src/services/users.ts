import { GetUsers, UpdateUser } from './interfaces/users';
import { apiUrl, getToken } from './utils';
import { FormData } from './../views/Profile/ProfileEdit/ProfileEdit';

export const getUsers = async (): Promise<GetUsers> => {
  const response = await fetch(`${apiUrl}/users`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
  });

  return await response.json();
};

export const findUser = async (login: string) => {
  const allUser = await getUsers();
  const user = Array.isArray(allUser) && allUser.find((user) => user.login === login);

  if (!user) return null;
  return user;
};

export const updateUser = async (user: FormData, id: string): Promise<UpdateUser> => {
  const response = await fetch(`${apiUrl}/users/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });

  return await response.json();
};
