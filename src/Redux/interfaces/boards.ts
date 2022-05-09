export interface BoardsInt {
  newBoard: boolean;
  isBoardsLoaded: boolean;
  boardsArray: BoardArrayInt[];
  selectedBoardId: string;
}

export interface BoardArrayInt {
  id: string;
  title: string;
}
