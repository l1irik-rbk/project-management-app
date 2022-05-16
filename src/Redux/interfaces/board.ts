import { FullBoard } from './../../services/interfaces/boards';

export interface BoardInt {
  selectedColumnId: string | null;
  currentBoardId: string | null;
  selectedTaskId: string | null;
  isBoardLoaded: boolean;
  board: FullBoard | null;
}
