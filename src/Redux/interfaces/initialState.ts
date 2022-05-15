import { FullBoard } from './../../services/interfaces/boards';
import { BoardsInt } from './boards';
export interface IInitialStateInt {
  token: string | null;
  userId: string | null;
  isTokenLoaded: boolean;
  boards: BoardsInt;
  currentBoard: BoardInt;
  confirmationModal: {
    type: ActionType | null;
    isPortalVisible: boolean;
  };
}

export interface BoardInt {
  selectedColumnId: string | null;
  currentBoardId: string | null;
  isBoardLoaded: boolean;
  board: FullBoard | null;
}

export enum ActionType {
  DELETE_BOARD = 'DELETE_BOARD',
  DELETE_COLUMN = 'DELETE_COLUMN',
}
