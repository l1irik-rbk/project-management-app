import { Action, combineReducers, configureStore, ThunkAction } from '@reduxjs/toolkit';

import { userSlice } from './slices/userSlice';
import { boardSlice } from './slices/boardSlice';
import { boardsSlice } from './slices/boardsSlice';
import { confirmationModalSlice } from './slices/confirmationModalSlice';

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

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
