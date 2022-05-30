import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ActionType } from '../../components/ConfirmationModal/ConfirmationModal';

export interface confirmationModalI {
  type: ActionType | null;
  isPortalVisible: boolean;
}

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
