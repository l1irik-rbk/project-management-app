import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { findUser, getLogin, getToken } from '../../services/utils';
import { AppThunk } from '../store';
import { deleteUser, updateUser } from '../../services/users';
import { signin, signup } from '../../services/auth';
import { Signin } from '../../services/interfaces/auth';
import { ResponseError } from '../../services/interfaces/error';
import { showError, showSuccess } from '../../components/ToasterMessage/ToasterMessage';

type user = {
  token: string | null;
  isTokenLoaded: boolean;
  redirect: string | null;
};

const initialState: user = {
  token: getToken(),
  isTokenLoaded: Boolean(getToken()),
  redirect: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },

    setTokenLoaded: (state, action: PayloadAction<boolean>) => {
      state.isTokenLoaded = action.payload;
    },

    setRedirect: (state, action: PayloadAction<string | null>) => {
      state.redirect = action.payload;
    },
  },
});

export const redirectThunk =
  (path: string): AppThunk =>
  async (dispatch) => {
    dispatch(userSlice.actions.setRedirect(path));
    setTimeout(() => dispatch(userSlice.actions.setRedirect(null)), 1000);
  };

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

        dispatch(redirectThunk('/'));
        showSuccess('toasterNotifications.user.success.deleteUser');
      } else showError((response as ResponseError).message);
    }
  }
};

export const loginUserThunk =
  (login: string, password: string): AppThunk =>
  async (dispatch) => {
    const signinResponse = await signin(login, password);

    if (signinResponse.hasOwnProperty('token')) {
      const token = (signinResponse as Signin).token;
      dispatch(setToken(token));
      dispatch(setTokenLoaded(true));

      dispatch(redirectThunk('main'));
      showSuccess('toasterNotifications.auth.success.signin');
    } else showError((signinResponse as ResponseError).message);
  };

export const signupUserThunk =
  (name: string, login: string, password: string): AppThunk =>
  async (dispatch) => {
    const response = await signup(name, login, password);

    if (!response.hasOwnProperty('statusCode')) {
      dispatch(loginUserThunk(login, password));
      showSuccess('toasterNotifications.auth.success.signup');
    } else showError((response as ResponseError).message);
  };

export const editUserThunk =
  (userObject: { name: string; login: string; password: string }, userId: string): AppThunk =>
  async (dispatch) => {
    const response = await updateUser(userObject, userId);

    if (!response.hasOwnProperty('error')) {
      showSuccess('toasterNotifications.user.success.updateUser');
      dispatch(redirectThunk('main'));
    } else showError((response as ResponseError).message);
  };

export const logoutUserThunk = (): AppThunk => async (dispatch) => {
  document.cookie = `token=${''}`;
  dispatch(setToken(null));
  dispatch(setTokenLoaded(false));

  dispatch(redirectThunk('/'));
  showSuccess('toasterNotifications.unauthorizated');
};

export const { setToken, setTokenLoaded } = userSlice.actions;
