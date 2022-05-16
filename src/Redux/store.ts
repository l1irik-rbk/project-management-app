import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import boardsReducer from './slices/boardsSlice';
import confirmationModalReducer from './slices/confirmationModalSlice';
import boardReducer from './slices/boardSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  boards: boardsReducer,
  board: boardReducer,
  confirmationModal: confirmationModalReducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
