export interface BoardsInt {
  newBoard: boolean;
  isBoardsLoaded: boolean;
  boardsArray: BoardArrayInt[];
  selectedBoardId: string | null;
}

export interface BoardArrayInt {
  id: string;
  title: string;
}
