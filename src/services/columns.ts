import { CreateColumnData } from '../views/Kanban/components/CreateColumnButton/CreateColumnButton';
import { CreateColumn, RemoveColumn } from './interfaces/columns';
import { apiUrl, getToken, successObject } from './utils';

export const createColumn = async (
  data: CreateColumnData,
  boardId: string
): Promise<CreateColumn> => {
  const response = await fetch(`${apiUrl}/boards/${boardId}/columns`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...data, order: Number(data.order) }),
  });

  return await response.json();
};

export const deleteColumn = async (boardId: string, columnId: string): Promise<RemoveColumn> => {
  const response = await fetch(`${apiUrl}/boards/${boardId}/columns/${columnId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (response.status === 204) return successObject;
  return await response.json();
};
