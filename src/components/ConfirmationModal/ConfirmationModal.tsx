import { fetchBoard } from '../../Redux/actionCreators/fetchBoard';
import { fetchBoards } from '../../Redux/actionCreators/fetchBoards';
import { ActionType } from '../../Redux/interfaces/confirmationModal';
import { useAppDispatch, useAppSelector } from '../../Redux/reduxHooks';
import { boardSlice } from '../../Redux/slices/boardSlice';
import { boardsSlice } from '../../Redux/slices/boardsSlice';
import { deleteBoard } from '../../services/boards';
import { deleteColumn } from '../../services/columns';
import { deleteTask } from '../../services/tasks';
import { deleteUser } from '../../services/users';
import { findUser, getLogin } from '../../services/utils';
import { CreatePortal } from './CreatePortal/CreatePortal';
import ModalWindow from './ModalWindow/ModalWindow';

export const ConfirmationModal = () => {
  const dispatch = useAppDispatch();
  const { setSelectedColumnId, setSelectedTaskId } = boardSlice.actions;
  const { setSelectedBoardId } = boardsSlice.actions;

  const { selectedBoardId } = useAppSelector((state) => state.boards);
  const { type } = useAppSelector((state) => state.confirmationModal);
  const { selectedColumnId, currentBoardId, selectedTaskId } = useAppSelector(
    (state) => state.board
  );

  const handlePortalAction = async () => {
    switch (type) {
      case ActionType.DELETE_BOARD:
        if (selectedBoardId) {
          const response = await deleteBoard(selectedBoardId);
          if (response.hasOwnProperty('success')) {
            dispatch(fetchBoards());
            dispatch(setSelectedBoardId(null));
          } else alert('Error');
        }
        break;
      case ActionType.DELETE_COLUMN:
        if (currentBoardId && selectedColumnId) {
          const response = await deleteColumn(currentBoardId, selectedColumnId);
          if (response.hasOwnProperty('success')) {
            dispatch(fetchBoard(currentBoardId));
            dispatch(setSelectedColumnId(null));
          } else alert('Error');
        }
        break;
      case ActionType.DELETE_TASK:
        if (currentBoardId && selectedColumnId && selectedTaskId) {
          const response = await deleteTask(currentBoardId, selectedColumnId, selectedTaskId);
          if (response.hasOwnProperty('success')) {
            dispatch(fetchBoard(currentBoardId));
            dispatch(setSelectedColumnId(null));
            dispatch(setSelectedTaskId(null));
          } else alert('Error');
        }
        break;
      case ActionType.DELETE_USER:
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

        break;
      default:
        return null;
    }
  };

  const getConfirmationModalText = (type: ActionType | null) => {
    switch (type) {
      case ActionType.DELETE_BOARD:
        return 'You will remove the board and all of its contents.';
      case ActionType.DELETE_COLUMN:
        return 'You want to delete this column? All tasks will be deleted. This action cannot be undone.';
      case ActionType.DELETE_TASK:
        return 'You want to delete this task? This action cannot be undone.';
      case ActionType.DELETE_USER:
        return 'You want to delete this user? This action cannot be undone.';
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
