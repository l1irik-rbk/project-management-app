import { CreateBoard, FullBoard, GetBoards, RemoveBoard } from './interfaces/boards';
import { apiUrl, getToken, successObject } from './utils';

const token = getToken();

export const getBoards = async (): Promise<GetBoards> => {
  const response = await fetch(`${apiUrl}/boards`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return await response.json();
};

export const createBoard = async (title: string): Promise<CreateBoard> => {
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

  return await response.json();
};

export const deleteBoard = async (id: string): Promise<RemoveBoard> => {
  const response = await fetch(`${apiUrl}/boards/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 204) return successObject;
  return await response.json();
};

export const getBoard = async (id: string): Promise<FullBoard> => {
  const response = await fetch(`${apiUrl}/boards/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return await response.json();
};
