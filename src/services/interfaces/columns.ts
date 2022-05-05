import { Error as ColumnError } from './error';

// ColumnsController_getAll
export type GetColumns = Column[] | ColumnError;

export interface Column {
  id: string;
  title: string;
  order: number;
}

// ColumnsController_create
export type CreateColumn = Column | ColumnError;

// ColumnsController_getOne
export type FullColumn = {
  id: string;
  title: string;
  order: number;
  tasks: Task[];
};

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

// ColumnsController_remove
export type RemoveColumnRequest = undefined | ColumnError;
// TODO: вместо undefined возвращает code 204
// http://localhost:4000/docs/static/index.html#/Columns/ColumnsController_remove

// ColumnsController_update
export type UpdateColumn = Column | ColumnError;
