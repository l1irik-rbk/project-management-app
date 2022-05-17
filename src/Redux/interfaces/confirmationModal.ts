export interface confirmationModalI {
  type: ActionType | null;
  isPortalVisible: boolean;
}

export enum ActionType {
  DELETE_BOARD = 'DELETE_BOARD',
  DELETE_COLUMN = 'DELETE_COLUMN',
  DELETE_TASK = 'DELETE_TASK',
}
