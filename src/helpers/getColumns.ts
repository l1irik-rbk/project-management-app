import { FullColumn } from './../services/interfaces/columns';
import { FullBoard } from './../services/interfaces/boards';

export const getColumns = (board: FullBoard): FullColumn[] => {
  const changeColumns = (board: FullBoard) => board.columns;
  return [...changeColumns(board)];
};
