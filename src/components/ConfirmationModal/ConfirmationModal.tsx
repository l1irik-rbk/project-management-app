import { deleteColumnFromBoard } from '../../helpers/deleteColumn';
import { filterByTasks } from '../../helpers/filterByTasks';
import { getColumns } from '../../helpers/getColumns';
import { fetchBoards } from '../../Redux/actionCreators/fetchBoards';
import { ActionType } from '../../Redux/interfaces/confirmationModal';
import { useAppDispatch, useAppSelector } from '../../Redux/reduxHooks';
import { boardSlice } from '../../Redux/slices/boardSlice';
import { boardsSlice } from '../../Redux/slices/boardsSlice';
import { deleteBoard } from '../../services/boards';
import { deleteColumn } from '../../services/columns';
import { UserError } from '../../services/interfaces/users';
import { deleteTask } from '../../services/tasks';
import { deleteUser } from '../../services/users';
import { findUser, getLogin } from '../../services/utils';
import { CreatePortal } from './CreatePortal/CreatePortal';
import ModalWindow from './ModalWindow/ModalWindow';

export const ConfirmationModal = () => {
  const dispatch = useAppDispatch();
  const { setSelectedColumnId, setNewColumn, setSelectedTaskId } = boardSlice.actions;
  const { setSelectedBoardId } = boardsSlice.actions;

  const { selectedBoardId } = useAppSelector((state) => state.boards);
  const { type } = useAppSelector((state) => state.confirmationModal);
  const { board, selectedColumnId, currentBoardId, selectedTaskId } = useAppSelector(
    (state) => state.board
  );

  const handlePortalAction = async () => {
    switch (type) {
      case ActionType.DELETE_BOARD:
        if (selectedBoardId) {
          await deleteBoard(selectedBoardId);
          dispatch(fetchBoards());
          dispatch(setSelectedBoardId(null));
        }
        break;
      case ActionType.DELETE_COLUMN:
        if (currentBoardId && selectedColumnId) {
          const result = await deleteColumn(currentBoardId, selectedColumnId);
          const columns = board ? getColumns(board) : null;
          const updatedColumns = deleteColumnFromBoard(columns, selectedColumnId);
          if (updatedColumns) dispatch(setNewColumn(updatedColumns));
          dispatch(setSelectedColumnId(null));
          if (result.hasOwnProperty('success')) alert('Column deleted');
          else alert('Error');
        }
        break;
      case ActionType.DELETE_TASK:
        if (currentBoardId && selectedColumnId && selectedTaskId) {
          const result = await deleteTask(currentBoardId, selectedColumnId, selectedTaskId);
          const columns = board ? getColumns(board) : null;
          const updatedColumns = filterByTasks(columns, selectedTaskId, selectedColumnId).sort(
            (a, b) => a.order - b.order
          );
          dispatch(setNewColumn(updatedColumns));
          dispatch(setSelectedColumnId(null));
          dispatch(setSelectedTaskId(null));
          if (result.hasOwnProperty('success')) alert('Task deleted');
          else alert('Error');
        }
        break;
      case ActionType.DELETE_USER:
        const login = getLogin();
        if (login) {
          const user = await findUser(login);
          if (user) {
            const response = await deleteUser(user.id);
            if (response.hasOwnProperty('statusCode')) {
              const error = response as UserError;
              alert(`${error.statusCode} ${error.message} ${error.error}`);
            } else {
              alert('Профиль удален');
            }
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
