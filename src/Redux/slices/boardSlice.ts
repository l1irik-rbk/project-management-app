import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { FullBoard, Column } from './../../services/interfaces/boards';
import { getBoard } from '../../services/boards';
import { deleteColumn } from '../../services/columns';
import { AppThunk } from '../store';
import { deleteColumnFromBoard } from '../../helpers/deleteColumn';
import { syncColumnsOrderWithServer } from '../../views/Kanban/components/utils';
import { FullColumn } from '../../services/interfaces/columns';
import { deleteTask } from '../../services/tasks';

export interface BoardInt {
  selectedColumnId: string | null;
  currentBoardId: string | null;
  selectedTaskId: string | null;
  isBoardLoaded: boolean;
  board: FullBoard | null;
}

const initialState: BoardInt = {
  selectedColumnId: null,
  selectedTaskId: null,
  currentBoardId: null,
  isBoardLoaded: false,
  board: null,
};

export const fetchBoard = createAsyncThunk('board/fetchBoard', async (id: string) => {
  const board = await getBoard(id);
  return board;
});

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setBoard: (state, action: PayloadAction<FullBoard>) => {
      state.board = action.payload;
    },
    setNewColumns: (state, action: PayloadAction<Column[]>) => {
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
  extraReducers: (builder) => {
    builder.addCase(fetchBoard.pending, (state) => {
      state.isBoardLoaded = false;
    });

    builder.addCase(fetchBoard.fulfilled, (state, action) => {
      state.isBoardLoaded = true;

      const board = action.payload;
      const sortBoard = {
        ...board,
        columns: board.columns
          .sort((a, b) => a.order - b.order)
          .map((column) => {
            const sortTask = column.tasks.sort((a, b) => a.order - b.order);
            return { ...column, tasks: sortTask };
          }),
      };

      state.board = sortBoard;
    });
  },
});

export const deleteColumnThunk =
  (currentBoardId: string, selectedColumnId: string): AppThunk =>
  async (dispatch, getState) => {
    const response = await deleteColumn(currentBoardId, selectedColumnId);
    if (response.hasOwnProperty('success')) {
      const board = getState().board.board;

      const columns = board?.columns as FullColumn[];
      let updatedColumns = deleteColumnFromBoard(columns, selectedColumnId);
      updatedColumns.sort((a, b) => a.order - b.order);
      updatedColumns = updatedColumns.map((column, index) => ({
        ...column,
        order: index,
      }));
      dispatch(setNewColumns(updatedColumns));
      dispatch(setSelectedColumnId(null));
      await syncColumnsOrderWithServer(updatedColumns, currentBoardId);
    } else alert('Error while deleting column');
  };

export const deleteTaskThunk =
  (currentBoardId: string, selectedColumnId: string, selectedTaskId: string): AppThunk =>
  async (dispatch, getState) => {
    const response = await deleteTask(currentBoardId, selectedColumnId, selectedTaskId);
    if (response.hasOwnProperty('success')) {
      const board = getState().board.board;

      const columns = board?.columns as FullColumn[];
      const currentColumn = columns?.filter(
        (column) => column.id === selectedColumnId
      )[0] as FullColumn;
      const columnsWithoutCurrent = columns?.filter((column) => column.id !== selectedColumnId);
      const currentColumnCopy = { ...currentColumn };
      const tasks = currentColumn.tasks.filter((task) => task.id !== selectedTaskId);
      currentColumnCopy.tasks = tasks;
      const updatedColumns = [...columnsWithoutCurrent, currentColumnCopy];
      dispatch(setNewColumns(updatedColumns));
      dispatch(setSelectedColumnId(null));
      dispatch(setSelectedTaskId(null));
    } else alert('Error while deleting task');
  };

export const {
  setBoard,
  setNewColumns,
  setSelectedColumnId,
  setCurrentBoardId,
  setSelectedTaskId,
} = boardSlice.actions;
