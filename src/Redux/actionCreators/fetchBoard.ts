import { createAsyncThunk } from '@reduxjs/toolkit';
import { getBoard } from '../../services/boards';

export const fetchBoard = createAsyncThunk('fetchBoard', async (id: string) => {
  const board = await getBoard(id);
  return board;
});
