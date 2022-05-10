import { BoardsInt } from './boards';
export interface IInitialStateInt {
  token: string | null;
  isTokenLoaded: boolean;
  isPortalVisible: boolean;
  boards: BoardsInt;
}
