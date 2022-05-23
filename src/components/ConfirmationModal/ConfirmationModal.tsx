import { useTranslation } from 'react-i18next';

import { deleteColumnFromBoard } from '../../helpers/deleteColumn';
import { fetchBoards } from '../../Redux/actionCreators/fetchBoards';
import { ActionType } from '../../Redux/interfaces/confirmationModal';
import { useAppDispatch, useAppSelector } from '../../Redux/reduxHooks';
import { boardSlice } from '../../Redux/slices/boardSlice';
import { boardsSlice } from '../../Redux/slices/boardsSlice';
import { deleteBoard } from '../../services/boards';
import { deleteColumn } from '../../services/columns';
import { FullColumn } from '../../services/interfaces/columns';
import { deleteTask } from '../../services/tasks';
import { deleteUser } from '../../services/users';
import { findUser, getLogin } from '../../services/utils';
import { syncColumnsOrderWithServer } from '../../views/Kanban/components/utils';
import { CreatePortal } from './CreatePortal/CreatePortal';
import ModalWindow from './ModalWindow/ModalWindow';

export const ConfirmationModal = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { setSelectedColumnId, setSelectedTaskId, setNewColumns } = boardSlice.actions;
  const { setSelectedBoardId } = boardsSlice.actions;

  const { selectedBoardId } = useAppSelector((state) => state.boards);
  const { type } = useAppSelector((state) => state.confirmationModal);
  const { selectedColumnId, currentBoardId, selectedTaskId, board } = useAppSelector(
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
            const columns = board?.columns as FullColumn[];
            let updatedColumns = deleteColumnFromBoard(columns, selectedColumnId);
            updatedColumns.sort((a, b) => a.order - b.order);
            updatedColumns = updatedColumns.map((column, index) => ({
              ...column,
              order: index,
            }));
            dispatch(setNewColumns(updatedColumns));
            dispatch(setSelectedColumnId(null));
            await syncColumnsOrderWithServer(updatedColumns, currentBoardId);
          } else alert('Error');
        }
        break;
      case ActionType.DELETE_TASK:
        if (currentBoardId && selectedColumnId && selectedTaskId) {
          const response = await deleteTask(currentBoardId, selectedColumnId, selectedTaskId);
          if (response.hasOwnProperty('success')) {
            const columns = board?.columns as FullColumn[];
            const currentColumn = columns?.filter(
              (column) => column.id === selectedColumnId
            )[0] as FullColumn;
            const columnsWithoutCurrent = columns?.filter(
              (column) => column.id !== selectedColumnId
            );
            const currentColumnCopy = { ...currentColumn };
            const tasks = currentColumn.tasks.filter((task) => task.id !== selectedTaskId);
            currentColumnCopy.tasks = tasks;
            const updatedColumns = [...columnsWithoutCurrent, currentColumnCopy];

            dispatch(setNewColumns(updatedColumns));
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
