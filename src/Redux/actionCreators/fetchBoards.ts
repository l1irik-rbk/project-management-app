import { createAsyncThunk } from '@reduxjs/toolkit';
import { getBoards } from '../../services/boards';

export const fetchBoards = createAsyncThunk('fetchBoards', async () => {
  const boards = await getBoards();
  return boards;
});
