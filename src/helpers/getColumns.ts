import { FullColumn } from './../services/interfaces/columns';
import { FullBoard } from './../services/interfaces/boards';

export const getColumns = (board: FullBoard | null): FullColumn[] | null => {
  if (!board) return null;
  const changeColumns = (board: FullBoard) => board.columns;
  return [...changeColumns(board)];
};
