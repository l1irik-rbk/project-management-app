import { BoardArrayInt } from './interfaces/boards';
import { IInitialStateInt, ActionType } from './interfaces/initialState';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchBoards } from './actionCreators/fetchBoards';
import { fetchBoard } from './actionCreators/fetchBoard';
import { Column, FullBoard } from '../services/interfaces/boards';
import { getToken } from '../services/utils';

const initialState: IInitialStateInt = {
  token: getToken(),
  userId: null,
  isTokenLoaded: Boolean(getToken()),
  boards: {
    newBoard: false,
    isBoardsLoaded: false,
    boardsArray: [],
    selectedBoardId: '',
  },
  currentBoard: {
    selectedColumnId: null,
    selectedTaskId: null,
    currentBoardId: null,
    isBoardLoaded: false,
    board: null,
  },
  confirmationModal: {
    type: null,
    isPortalVisible: false,
  },
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string | null>) => {
      state.userId = action.payload;
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    setTokenLoaded: (state, action: PayloadAction<boolean>) => {
      state.isTokenLoaded = action.payload;
    },
    setNewBoard: (state, action: PayloadAction<boolean>) => {
      state.boards.newBoard = action.payload;
    },
    setSelectedBoardId: (state, action: PayloadAction<string | null>) => {
      state.boards.selectedBoardId = action.payload;
    },
    setPortalVisible: (state, action: PayloadAction<boolean>) => {
      state.confirmationModal.isPortalVisible = action.payload;
    },
    setConfirmationModalType: (state, action: PayloadAction<ActionType | null>) => {
      state.confirmationModal.type = action.payload;
    },
    setNewColumn: (state, action: PayloadAction<Column[]>) => {
      if (state.currentBoard.board) state.currentBoard.board.columns = action.payload;
    },
    setSelectedColumnId: (state, action: PayloadAction<string | null>) => {
      state.currentBoard.selectedColumnId = action.payload;
    },
    setCurrentBoardId: (state, action: PayloadAction<string | null>) => {
      state.currentBoard.currentBoardId = action.payload;
    },
    setSelectedTaskId: (state, action: PayloadAction<string | null>) => {
      state.currentBoard.selectedTaskId = action.payload;
    },
  },
  extraReducers: {
    [fetchBoards.pending.type]: (state) => {
      state.boards.isBoardsLoaded = false;
    },
    [fetchBoards.fulfilled.type]: (state, action: PayloadAction<BoardArrayInt[]>) => {
      state.boards.isBoardsLoaded = true;
      state.boards.boardsArray = action.payload;
    },
    [fetchBoard.pending.type]: (state) => {
      state.currentBoard.isBoardLoaded = false;
    },
    [fetchBoard.fulfilled.type]: (state, action: PayloadAction<FullBoard>) => {
      state.currentBoard.isBoardLoaded = true;
      state.currentBoard.board = action.payload;
    },
  },
});

export default appSlice.reducer;
export const {
  setToken,
  setTokenLoaded,
  setNewBoard,
  setPortalVisible,
  setSelectedColumnId,
  setSelectedBoardId,
  setConfirmationModalType,
  setNewColumn,
  setCurrentBoardId,
  setSelectedTaskId,
} = appSlice.actions;
