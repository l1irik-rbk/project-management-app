import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { findUser, getLogin, getToken } from '../../services/utils';
import { AppThunk } from '../store';
import { deleteUser } from '../../services/users';
import {
  showErrorToaster,
  showSuccessToaster,
} from '../../components/ToasterMessage/ToasterMessage';

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

export const deleteUserThunk = (): AppThunk => async (dispatch) => {
  const login = getLogin();
  if (login) {
    const user = await findUser(login);
    if (user) {
      const response = await deleteUser(user.id);

      if (response.hasOwnProperty('success')) {
        document.cookie = `token=${''}`;
        dispatch(setToken(null));
        dispatch(setTokenLoaded(false));
        showSuccessToaster('toasterNotifications.user.success.deleteUser');
      } else showErrorToaster('toasterNotifications.user.errors.deleteUser');
    }
  }
};

export const { setToken, setTokenLoaded } = authSlice.actions;
