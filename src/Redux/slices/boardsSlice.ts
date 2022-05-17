import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { BoardsInt, BoardArrayInt } from './../interfaces/boards';
import { fetchBoards } from '../actionCreators/fetchBoards';

const initialState: BoardsInt = {
  newBoard: false,
  isBoardsLoaded: false,
  boardsArray: [],
  selectedBoardId: '',
};

export const boardsSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    setNewBoard: (state, action: PayloadAction<boolean>) => {
      state.newBoard = action.payload;
    },
    setSelectedBoardId: (state, action: PayloadAction<string | null>) => {
      state.selectedBoardId = action.payload;
    },
  },
  extraReducers: {
    [fetchBoards.pending.type]: (state) => {
      state.isBoardsLoaded = false;
    },
    [fetchBoards.fulfilled.type]: (state, action: PayloadAction<BoardArrayInt[]>) => {
      state.isBoardsLoaded = true;
      state.boardsArray = action.payload;
    },
  },
});

export default boardsSlice.reducer;
export const { setNewBoard, setSelectedBoardId } = boardsSlice.actions;
