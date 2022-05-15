import { FullColumn } from '../services/interfaces/columns';

export const deleteColumnFromBoard = (
  columns: FullColumn[] | null,
  selectedColumnId: string
): FullColumn[] | undefined => {
  return columns?.filter((column) => column.id !== selectedColumnId);
};
