import { BoardsInt } from './boards';
export interface IInitialStateInt {
  token: string | null;
  userId: string | null;
  isTokenLoaded: boolean;
  boards: BoardsInt;
  board: {
    id: string | null;
  };
  confirmationModal: {
    isConfirmed: boolean;
    type: ActionType | null;
    isPortalVisible: boolean;
  };
}

export enum ActionType {
  DELETE_BOARD = 'DELETE_BOARD',
  DELETE_COLUMN = 'DELETE_COLUMN',
}
