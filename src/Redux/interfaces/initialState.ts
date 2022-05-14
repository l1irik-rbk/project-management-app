import { BoardsInt } from './boards';
export interface IInitialStateInt {
  token: string | null;
  userId: string | null;
  isTokenLoaded: boolean;
  isPortalVisible: boolean;
  boards: BoardsInt;
  board: {
    id: string | null;
  };
}
