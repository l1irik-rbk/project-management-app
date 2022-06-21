import { GetUsers, RemoveUser, UpdateUser } from './interfaces/users';
import { apiUrl, getToken, successObject } from './utils';
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

export const deleteUser = async (id: string): Promise<RemoveUser> => {
  const response = await fetch(`${apiUrl}/users/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (response.status === 204) return successObject;
  return await response.json();
};
