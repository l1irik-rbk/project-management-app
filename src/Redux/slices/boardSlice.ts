import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { FullBoard, Column } from './../../services/interfaces/boards';
import { getBoard } from '../../services/boards';
import { createColumn, deleteColumn, updateColumn } from '../../services/columns';
import { AppThunk } from '../store';
import { FullColumn } from '../../services/interfaces/columns';
import { createTask, deleteTask, updateTask } from '../../services/tasks';
import { getUserId } from '../../services/utils';
import { showError, showSuccess } from '../../components/ToasterMessage/ToasterMessage';
import { FullTask, UpdateError } from '../../services/interfaces/tasks';
import { ResponseError } from '../../services/interfaces/error';

export interface BoardInt {
  selectedColumnId: string | null;
  currentBoardId: string | null;
  selectedTaskId: string | null;
  isBoardLoaded: boolean;
  boardError: boolean;
  board: FullBoard | null;
}

const initialState: BoardInt = {
  selectedColumnId: null,
  selectedTaskId: null,
  currentBoardId: null,
  isBoardLoaded: false,
  boardError: false,
  board: null,
};

export const fetchBoard = createAsyncThunk('board/fetchBoard', async (id: string, thunAPI) => {
  try {
    const board = await getBoard(id);

    if (board.hasOwnProperty('statusCode')) {
      throw new Error();
    }
    return board;
  } catch (error) {
    return thunAPI.rejectWithValue('Board not found');
  }
});

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setBoard: (state, action: PayloadAction<FullBoard>) => {
      state.board = action.payload;
    },
    setColumns: (state, action: PayloadAction<Column[]>) => {
      const columns = action.payload;
      const sortedColumns = columns
        .sort((a, b) => a.order - b.order)
        .map((column) => {
          const sortTask = column.tasks.slice().sort((a, b) => a.order - b.order);
          return { ...column, tasks: sortTask };
        });

      if (state.board) state.board.columns = sortedColumns;
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
    setBoardTitle: (state, action: PayloadAction<string>) => {
      if (state.board) state.board.title = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBoard.pending, (state) => {
      state.isBoardLoaded = false;
      state.boardError = false;
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
    builder.addCase(fetchBoard.rejected, (state) => {
      state.isBoardLoaded = true;
      state.boardError = true;
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
      showSuccess('toasterNotifications.board.success.deleteColumn');
    } else showError((response as ResponseError).message);
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
      showSuccess('toasterNotifications.board.success.deleteTask');
    } else showError((response as ResponseError).message);
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
      showSuccess('toasterNotifications.board.success.createColumn');
    } else showError((response as ResponseError).message);
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
      showSuccess('toasterNotifications.board.success.createTask');
    } else showError('toasterNotifications.board.errors.createTask');
    // TODO: проблема с типизация возвращаемой от async
  };

export const editTaskThunk =
  (
    boardId: string,
    columnId: string,
    task: FullTask,
    title: string,
    description: string
  ): AppThunk =>
  async (dispatch) => {
    const updateResponse = await updateTask(boardId, columnId, {
      ...task,
      title,
      description,
    });

    if (!updateResponse.hasOwnProperty('error')) {
      dispatch(fetchBoard(boardId));
      showSuccess('toasterNotifications.board.success.updateTask');
    } else
      showError(
        `${(updateResponse as UpdateError).message} ${(updateResponse as UpdateError).error}`
      );
    // TODO: в случае ошибки от сервера вернуть действия в редаксе назад
  };

export const editColumnTitleThunk =
  (boardId: string, columnId: string, title: string, order: number, board: FullBoard): AppThunk =>
  async (dispatch) => {
    const response = await updateColumn(boardId, columnId, title, order);
    if (!response.hasOwnProperty('error')) {
      const oldColumns = board?.columns;
      const updatedOldColumns = [...(oldColumns as Column[])];
      const columns = board?.columns;
      const updatedColumn = columns?.filter((column) => column.id === columnId)[0] as Column;
      const newColumn = { ...updatedColumn };
      newColumn.title = title;
      const oldColumnIndex = columns?.findIndex((column) => column.id === newColumn.id) as number;
      updatedOldColumns.splice(oldColumnIndex, 1, newColumn);
      dispatch(setColumns(updatedOldColumns));
      showSuccess('toasterNotifications.board.success.updateColumn');
    } else showError((response as ResponseError).message);
  };

export const {
  setBoard,
  setColumns,
  setSelectedColumnId,
  setCurrentBoardId,
  setSelectedTaskId,
  setBoardTitle,
} = boardSlice.actions;
