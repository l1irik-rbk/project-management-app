import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { confirmationModalI } from '../interfaces/confirmationModal';
import { ActionType } from '../interfaces/confirmationModal';

const initialState: confirmationModalI = {
  type: null,
  isPortalVisible: false,
};

export const confirmationModalSlice = createSlice({
  name: 'confirmationModal',
  initialState,
  reducers: {
    setPortalVisible: (state, action: PayloadAction<boolean>) => {
      state.isPortalVisible = action.payload;
    },
    setConfirmationModalType: (state, action: PayloadAction<ActionType | null>) => {
      state.type = action.payload;
    },
  },
});

export const { setPortalVisible, setConfirmationModalType } = confirmationModalSlice.actions;
