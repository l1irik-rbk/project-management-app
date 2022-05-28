import { Column } from './interfaces/boards';
import { FullColumn, RemoveColumn, ColumnError, UpdateColumn } from './interfaces/columns';
import { apiUrl, getToken, successObject } from './utils';

const token = getToken();

export const createColumn = async (
  title: string,
  boardId: string
): Promise<Column | ColumnError> => {
  const response = await fetch(`${apiUrl}/boards/${boardId}/columns`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });

  return await response.json();
};

export const deleteColumn = async (boardId: string, columnId: string): Promise<RemoveColumn> => {
  const response = await fetch(`${apiUrl}/boards/${boardId}/columns/${columnId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 204) return successObject;
  return await response.json();
};

export const getColumn = async (boardId: string, columnId: string): Promise<FullColumn> => {
  const response = await fetch(`${apiUrl}/boards/${boardId}/columns/${columnId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
};

export const updateColumn = async (
  boardId: string,
  columnId: string,
  title: string,
  order: number
): Promise<UpdateColumn> => {
  const response = await fetch(`${apiUrl}/boards/${boardId}/columns/${columnId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      order,
    }),
  });

  return await response.json();
};
