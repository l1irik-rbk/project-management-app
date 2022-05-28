import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { FullBoard, Column } from './../../services/interfaces/boards';
import { getBoard } from '../../services/boards';
import { createColumn, deleteColumn } from '../../services/columns';
import { AppThunk } from '../store';
import { FullColumn } from '../../services/interfaces/columns';
import { createTask, deleteTask } from '../../services/tasks';
import { getUserId } from '../../services/utils';
import {
  showErrorToaster,
  showSuccessToaster,
} from '../../components/ToasterMessage/ToasterMessage';

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
    setColumns: (state, action: PayloadAction<Column[]>) => {
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
      const updatedColumns = columns?.filter((column) => column.id !== selectedColumnId);

      dispatch(setColumns(updatedColumns));
      dispatch(setSelectedColumnId(null));
      showSuccessToaster('toasterNotifications.board.success.deleteColumn');
    } else showErrorToaster('toasterNotifications.board.errors.deleteColumn');
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
      dispatch(setColumns(updatedColumns));
      dispatch(setSelectedColumnId(null));
      dispatch(setSelectedTaskId(null));
      showSuccessToaster('toasterNotifications.board.success.deleteTask');
    } else showErrorToaster('toasterNotifications.board.errors.deleteTask');
  };

export const createColumnThunk =
  (title: string, currentBoardId: string): AppThunk =>
  async (dispatch, getState) => {
    const response = await createColumn(title, currentBoardId);
    if (response.hasOwnProperty('id')) {
      const newColumn = response as Column;
      newColumn.tasks = [];
      const columns = getState()?.board.board?.columns.slice() as FullColumn[];

      dispatch(setColumns([...columns, newColumn]));
      showSuccessToaster('toasterNotifications.board.success.createColumn');
    } else showErrorToaster('toasterNotifications.board.errors.createColumn');
  };

export const createTaskThunk =
  (title: string, description: string, boardId: string, columnId: string): AppThunk =>
  async (dispatch, getState) => {
    // TODO: add userId in redux
    const userId = await getUserId();
    if (!userId) return;

    const createResponse = await createTask(title, description, boardId, columnId, userId);

    if (createResponse.hasOwnProperty('id')) {
      const { id, title, order, description, userId } = createResponse;
      const board = getState().board.board;
      const columns = board?.columns as FullColumn[];
      const currentColumn = columns?.filter((column) => column.id === columnId)[0] as FullColumn;
      const columnsWithoutCurrent = columns?.filter((column) => column.id !== columnId);
      const currentColumnCopy = { ...currentColumn };
      const newTask = { description, files: [], id, order, title, userId, done: false };
      const copyOfCurrentTasks = [...currentColumn.tasks];
      copyOfCurrentTasks.push(newTask);
      currentColumnCopy.tasks = copyOfCurrentTasks;
      const updatedColumns = [...columnsWithoutCurrent, currentColumnCopy];

      dispatch(setColumns(updatedColumns));
      showSuccessToaster('toasterNotifications.board.success.createTask');
    } else showErrorToaster('toasterNotifications.board.errors.createTask');
  };

export const { setBoard, setColumns, setSelectedColumnId, setCurrentBoardId, setSelectedTaskId } =
  boardSlice.actions;
