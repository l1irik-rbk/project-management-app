import { Column, Task } from '../services/interfaces/boards';

export const keysToSameValueAsKeys = (newColumns: Column[]): { [k: string]: Task[] } => {
  return newColumns.reduce((acc, item) => ({ ...acc, [item.id]: item.tasks }), {});
};
