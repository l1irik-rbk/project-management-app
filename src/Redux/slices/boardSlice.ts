import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { BoardInt } from './../interfaces/board';
import { FullBoard, Column } from './../../services/interfaces/boards';
import { fetchBoard } from '../actionCreators/fetchBoard';

const initialState: BoardInt = {
  selectedColumnId: null,
  selectedTaskId: null,
  currentBoardId: null,
  isBoardLoaded: false,
  board: null,
};

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setBoard: (state, action: PayloadAction<FullBoard>) => {
      state.board = action.payload;
    },
    setNewColumn: (state, action: PayloadAction<Column[]>) => {
      if (state.board) state.board.columns = action.payload;
    },
    setSelectedColumnId: (state, action: PayloadAction<string | null>) => {
      state.selectedColumnId = action.payload;
    },
    setCurrentBoardId: (state, action: PayloadAction<string | null>) => {
      state.currentBoardId = action.payload;
    },
    setSelectedTaskId: (state, action: PayloadAction<string | null>) => {
      state.selectedTaskId = action.payload;
    },
  },
  extraReducers: {
    [fetchBoard.pending.type]: (state) => {
      state.isBoardLoaded = false;
    },
    [fetchBoard.fulfilled.type]: (state, action: PayloadAction<FullBoard>) => {
      state.isBoardLoaded = true;
      state.board = action.payload;
    },
  },
});

export const { setBoard, setNewColumn, setSelectedColumnId, setCurrentBoardId, setSelectedTaskId } =
  boardSlice.actions;
