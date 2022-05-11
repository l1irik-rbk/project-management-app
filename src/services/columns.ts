import { CreateColumnData } from '../views/Kanban/components/CreateColumnButton/CreateColumnButton';
import { CreateColumn } from './interfaces/columns';
import { apiUrl, getToken } from './utils';

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
