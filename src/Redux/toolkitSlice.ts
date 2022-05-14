import { BoardArrayInt } from './interfaces/boards';
import { IInitialStateInt } from './interfaces/initialState';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchBoards } from './actionCreators/fetchBoards';

const initialState: IInitialStateInt = {
  token: null,
  userId: null,
  isTokenLoaded: false,
  isPortalVisible: false,
  boards: {
    newBoard: false,
    isBoardsLoaded: false,
    boardsArray: [],
    selectedBoardId: '',
  },
  board: {
    id: null,
  },
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string | null>) => {
      state.userId = action.payload;
    },
    setBoardId: (state, action: PayloadAction<string | null>) => {
      state.board.id = action.payload;
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
    setSelectedBoardId: (state, action: PayloadAction<string>) => {
      state.boards.selectedBoardId = action.payload;
    },
    setPortalVisible: (state, action: PayloadAction<boolean>) => {
      state.isPortalVisible = action.payload;
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
  },
});

export default appSlice.reducer;
export const {
  setToken,
  setTokenLoaded,
  setNewBoard,
  setPortalVisible,
  setBoardId,
  setSelectedBoardId,
} = appSlice.actions;
