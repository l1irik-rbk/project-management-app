import { apiUrl } from './utils';

export const getBoards = async (token: string) => {
  const response = await fetch(`${apiUrl}/boards`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) return { statusCode: 666, message: 'Server error' };
  return await response.json();
};

export const createBoard = async (title: string, token: string) => {
  const response = await fetch(`${apiUrl}/boards`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
    }),
  });

  if (!response.ok) return { statusCode: 666, message: 'Server error' };
  return await response.json();
};

export const deleteBoard = async (id: string, token: string) => {
  const response = await fetch(`${apiUrl}/boards/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(response);

  if (!response.ok) return { statusCode: 666, message: 'Server error' };
  return { statusCode: 204, message: 'DELETED' };
};
