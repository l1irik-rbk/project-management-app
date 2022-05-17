import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { authSlice } from './slices/authSlice';
import { boardSlice } from './slices/boardSlice';
import { boardsSlice } from './slices/boardsSlice';
import { confirmationModalSlice } from './slices/confirmationModalSlice';

const rootReducer = combineReducers({
  auth: authSlice.reducer,
  boards: boardsSlice.reducer,
  board: boardSlice.reducer,
  confirmationModal: confirmationModalSlice.reducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    devTools: true,
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
