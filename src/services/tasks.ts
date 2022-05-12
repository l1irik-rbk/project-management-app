import { CreateTaskData } from '../views/Kanban/components/CreateTaskButton/CreateTaskButton';
import { CreateTask, RemoveTask } from './interfaces/tasks';
import { apiUrl, getToken, successObject } from './utils';

export const createTask = async (
  data: CreateTaskData,
  boardId: string,
  columnId: string,
  userId: string
): Promise<CreateTask> => {
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

export const deleteTask = async (
  boardId: string,
  columnId: string,
  taskId: string
): Promise<RemoveTask> => {
  const response = await fetch(`${apiUrl}/boards/${boardId}/columns/${columnId}/tasks/${taskId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (response.status === 204) return successObject;
  return await response.json();
};
