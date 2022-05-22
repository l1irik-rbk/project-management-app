import { FullColumn } from '../services/interfaces/columns';

export const deleteColumnFromBoard = (
  columns: FullColumn[],
  selectedColumnId: string
): FullColumn[] => {
  return columns?.filter((column) => column.id !== selectedColumnId);
};
