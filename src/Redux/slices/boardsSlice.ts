import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { createBoard, deleteBoard, getBoards } from '../../services/boards';
import { Board } from '../../services/interfaces/boards';

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

export const fetchBoardsThunk = createAsyncThunk('boards/fetchBoards', async () => {
  const boards = await getBoards();

  if (Array.isArray(boards)) return boards;
  else alert('Error while fetching boards');
});

export const deleteBoardThunk = createAsyncThunk(
  'boards/deleteBoard',
  async (selectedBoardId: string) => {
    const response = await deleteBoard(selectedBoardId);

    if (response.hasOwnProperty('success')) return response;
    else alert('Error while deleting board');
  }
);

export const createBoardThunk = createAsyncThunk(
  'boards/addBoard',
  async (object: { title: string; description: string }) => {
    const { title, description } = object;
    const response = await createBoard(title, description);
    if (response.hasOwnProperty('id')) return response as Board;
    else alert('Error while creating board');
  }
);

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
      state.isBoardsLoaded = true;
      if (action.payload) state.boardsArray = action.payload;
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

export const { setIsOpenModalCreateNewBoard, setSelectedBoardId } = boardsSlice.actions;
