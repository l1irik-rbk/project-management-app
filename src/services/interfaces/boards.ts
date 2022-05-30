import { successObject } from '../utils';
import { ResponseError as BoardError, ResponseErrorWithFieldError } from './error';

// BoardsController_getAll
export type GetBoards = Board[] | ResponseErrorWithFieldError;

export interface Board {
  id: string;
  title: string;
  description: string;
}

// BoardsController_create
export type CreateBoard = Board | BoardError;

// BoardsController_getOne
export interface FullBoard {
  id: string;
  title: string;
  columns: Column[];
}

export interface Column {
  id: string;
  title: string;
  order: number;
  tasks: Task[];
}

export interface Task {
  id: string;
  title: string;
  order: number;
  done: boolean;
  description: string;
  userId: string;
  files: File[];
}

export interface File {
  filename: string;
  fileSize: number;
}

// BoardsController_remove
export type RemoveBoard = typeof successObject | BoardError;

// BoardsController_update
export type UpdateBoard = Board | BoardError;
