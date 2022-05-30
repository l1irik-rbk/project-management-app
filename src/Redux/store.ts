import { Action, combineReducers, configureStore, ThunkAction } from '@reduxjs/toolkit';

import { logoutExpiredUserThunk, userSlice } from './slices/userSlice';
import { boardSlice } from './slices/boardSlice';
import { boardsSlice } from './slices/boardsSlice';
import { confirmationModalSlice } from './slices/confirmationModalSlice';
import { getToken } from '../services/utils';

const rootReducer = combineReducers({
  user: userSlice.reducer,
  boards: boardsSlice.reducer,
  board: boardSlice.reducer,
  confirmationModal: confirmationModalSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: true,
});

const unsubscribe = store.subscribe(() => {
  const token = getToken();
  // console.log('token', token);
  if (!token) {
    // console.log('logoutExpiredUserThunk');
    setTimeout(() => store.dispatch(logoutExpiredUserThunk()), 10);
    unsubscribe();

    setTimeout(() => {
      store.subscribe(() => {
        const token = getToken();
        // console.log('token', token);
        if (!token) {
          // console.log('logoutExpiredUserThunk');
          setTimeout(() => store.dispatch(logoutExpiredUserThunk()), 10);
          unsubscribe();
        }
      });
    }, 1000);
  }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
