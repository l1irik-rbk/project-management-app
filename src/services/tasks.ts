import { CreateTaskData } from '../views/Kanban/components/CreateTaskButton/CreateTaskButton';
import { CreateTask, RemoveTask, Task, UpdateTask } from './interfaces/tasks';
import { apiUrl, getToken, getUserId, successObject } from './utils';

const token = getToken();

export const createTask = async (
  title: string,
  order: number,
  description: string,
  boardId: string,
  columnId: string,
  userId: string
): Promise<CreateTask> => {
  const response = await fetch(`${apiUrl}/boards/${boardId}/columns/${columnId}/tasks`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, order, description, userId }),
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
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 204) return successObject;
  return await response.json();
};

export const updateTask = async (
  boardId: string,
  columnId: string,
  task: Task
): Promise<UpdateTask> => {
  const userId = await getUserId();
  const { title, order, description } = task;
  const response = await fetch(`${apiUrl}/boards/${boardId}/columns/${columnId}/tasks/${task.id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      order: Number(order),
      description,
      userId,
      boardId,
      columnId,
    }),
  });
  // console.log(await response.json());
  return await response.json();
};
