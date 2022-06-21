import { successObject } from '../utils';
import { ResponseError, ResponseErrorWithFieldError } from './error';

export type TaskError = ResponseError;

// TasksController_getAll
export type GetTasks = Task[] | TaskError;

export interface Task {
  id: string;
  title: string;
  order: number;
  description: string;
  userId: string;
  // boardId?: string;
  // columnId?: string;
}

// TasksController_create
export type CreateTask = Task;

// TasksController_getOne
export type FullTask = Task;

// TasksController_remove
export type RemoveTask = typeof successObject | TaskError;

// TasksController_update
export type UpdateError = ResponseErrorWithFieldError;
export type UpdateTask = Task | UpdateError;
