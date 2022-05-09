import { createAsyncThunk } from '@reduxjs/toolkit';
import { getBoards } from '../../services/boards';

export const fetchBoards = createAsyncThunk('fetchBoards', async (token: string) => {
  const boards = await getBoards(token);
  return boards;
});
