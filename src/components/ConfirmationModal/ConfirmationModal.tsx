import { useTranslation } from 'react-i18next';

import { useAppDispatch, useAppSelector } from '../../Redux/hooks';
import { deleteUserThunk } from '../../Redux/slices/authSlice';
import { deleteColumnThunk, deleteTaskThunk } from '../../Redux/slices/boardSlice';
import { deleteBoardThunk } from '../../Redux/slices/boardsSlice';
import { CreatePortal } from './CreatePortal/CreatePortal';
import ModalWindow from './ModalWindow/ModalWindow';

export enum ActionType {
  DELETE_BOARD = 'DELETE_BOARD',
  DELETE_COLUMN = 'DELETE_COLUMN',
  DELETE_TASK = 'DELETE_TASK',
  DELETE_USER = 'DELETE_USER',
}

export const ConfirmationModal = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { selectedBoardId } = useAppSelector((state) => state.boards);
  const { type } = useAppSelector((state) => state.confirmationModal);
  const { selectedColumnId, currentBoardId, selectedTaskId } = useAppSelector(
    (state) => state.board
  );

  const handlePortalAction = async () => {
    switch (type) {
      case ActionType.DELETE_BOARD:
        if (!selectedBoardId) return;
        dispatch(deleteBoardThunk(selectedBoardId));
        break;

      case ActionType.DELETE_COLUMN:
        if (!currentBoardId || !selectedColumnId) return;
        dispatch(deleteColumnThunk(currentBoardId, selectedColumnId));
        break;

      case ActionType.DELETE_TASK:
        if (!currentBoardId || !selectedColumnId || !selectedTaskId) return;
        dispatch(deleteTaskThunk(currentBoardId, selectedColumnId, selectedTaskId));
        break;

      case ActionType.DELETE_USER:
        dispatch(deleteUserThunk());
        break;

      default:
        return null;
    }
  };

  const getConfirmationModalText = (type: ActionType | null) => {
    switch (type) {
      case ActionType.DELETE_BOARD:
        return t('confirmationModal.delete.board');
      case ActionType.DELETE_COLUMN:
        return t('confirmationModal.delete.column');
      case ActionType.DELETE_TASK:
        return t('confirmationModal.delete.task');
      case ActionType.DELETE_USER:
        return t('confirmationModal.delete.user');
      default:
        return '';
    }
  };

  return (
    <CreatePortal>
      <ModalWindow text={getConfirmationModalText(type)} onConfirm={handlePortalAction} />
    </CreatePortal>
  );
};
