import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { createBoard, deleteBoard, getBoards, updateBoard } from '../../services/boards';
import { Board } from '../../services/interfaces/boards';
import { ResponseError, ResponseErrorWithFieldError } from '../../services/interfaces/error';
import { AppThunk } from '../store';
import { setBoardTitle } from './boardSlice';
import { showError, showSuccess } from '../../components/ToasterMessage/ToasterMessage';

export interface Boards {
  isOpenModalCreateNewBoard: boolean;
  isBoardsLoaded: boolean;
  boardsArray: Board[] | null;
  selectedBoardId: string | null;
}

const initialState: Boards = {
  isOpenModalCreateNewBoard: false,
  isBoardsLoaded: false,
  boardsArray: null,
  selectedBoardId: null,
};

export const boardsSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    setIsOpenModalCreateNewBoard: (state, action: PayloadAction<boolean>) => {
      state.isOpenModalCreateNewBoard = action.payload;
    },

    setSelectedBoardId: (state, action: PayloadAction<string | null>) => {
      state.selectedBoardId = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchBoardsThunk.pending, (state) => {
      state.isBoardsLoaded = false;
    });

    builder.addCase(fetchBoardsThunk.fulfilled, (state, action) => {
      if (action.payload) {
        state.isBoardsLoaded = true;
        state.boardsArray = action.payload;
      }
    });

    builder.addCase(deleteBoardThunk.fulfilled, (state) => {
      if (state.boardsArray)
        state.boardsArray = state.boardsArray?.filter(
          (board) => board.id !== state.selectedBoardId
        );
      state.selectedBoardId = null;
    });

    builder.addCase(createBoardThunk.fulfilled, (state, action) => {
      state.isOpenModalCreateNewBoard = false;
      if (state.boardsArray && action.payload) state.boardsArray.push(action.payload);
    });
  },
});

export const fetchBoardsThunk = createAsyncThunk('boards/fetchBoards', async () => {
  const response = await getBoards();
  if (Array.isArray(response)) return response;
  else showError((response as ResponseError).message);
});

export const deleteBoardThunk = createAsyncThunk(
  'boards/deleteBoard',
  async (selectedBoardId: string) => {
    const response = await deleteBoard(selectedBoardId);

    if (response.hasOwnProperty('success')) {
      showSuccess('toasterNotifications.boards.success.deleteBoard');
      return response;
    } else {
      showError((response as ResponseError).message);
    }
  }
);

export const createBoardThunk = createAsyncThunk(
  'boards/addBoard',
  async (object: { title: string; description: string }) => {
    const { title, description } = object;
    const response = await createBoard(title, description);
    if (response.hasOwnProperty('id')) {
      showSuccess('toasterNotifications.boards.success.addBoard');
      return response as Board;
    } else showError((response as ResponseErrorWithFieldError).message);
  }
);

export const changeBoardThunk =
  (id: string, title: string, description: string): AppThunk =>
  async (dispatch) => {
    const response = await updateBoard(id, title, description);
    if (!response.hasOwnProperty('error')) {
      dispatch(fetchBoardsThunk());
      dispatch(setBoardTitle(title));
      showSuccess('toasterNotifications.board.success.updateTask');
    } else {
      // TODO: edit type updateBoard
      showError('toasterNotifications.board.errors.updateTask');
    }
  };

export const { setIsOpenModalCreateNewBoard, setSelectedBoardId } = boardsSlice.actions;
