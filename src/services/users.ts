import { GetUser, GetUsers } from './interfaces/users';
import { apiUrl, getToken } from './utils';

export const getUser = async (id: string): Promise<GetUser> => {
  const response = await fetch(`${apiUrl}/boards`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
  });

  return await response.json();
};

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
