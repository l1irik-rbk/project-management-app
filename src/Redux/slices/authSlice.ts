import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { authStateI } from './../interfaces/auth';
import { getToken } from '../../services/utils';

const initialState: authStateI = {
  token: getToken(),
  isTokenLoaded: Boolean(getToken()),
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    setTokenLoaded: (state, action: PayloadAction<boolean>) => {
      state.isTokenLoaded = action.payload;
    },
  },
});

export default authSlice.reducer;
export const { setToken, setTokenLoaded } = authSlice.actions;
