import { CreateTaskData } from '../views/Kanban/components/CreateTaskButton/CreateTaskButton';
import { apiUrl, getToken } from './utils';

export const createTask = async (
  data: CreateTaskData,
  boardId: string,
  columnId: string,
  userId: string
) => {
  const response = await fetch(`${apiUrl}/boards/${boardId}/columns/${columnId}/tasks`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...data, order: Number(data.order), userId }),
  });
  return await response.json();
};
