import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { findUser, getLogin, getToken } from '../../services/utils';
import { AppThunk } from '../store';
import { deleteUser } from '../../services/users';

type auth = {
  token: string | null;
  isTokenLoaded: boolean;
};

const initialState: auth = {
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const deleteUserThunk = (): AppThunk => async (dispatch, getState) => {
  const login = getLogin();
  if (login) {
    const user = await findUser(login);
    if (user) {
      const response = await deleteUser(user.id);
      if (response.hasOwnProperty('success')) {
        alert('Профиль удален');
      } else alert('Error');
    }
  }
};

export const { setToken, setTokenLoaded } = authSlice.actions;
