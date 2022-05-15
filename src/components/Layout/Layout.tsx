import { Outlet, useLocation } from 'react-router-dom';

import { Footer } from '../Footer/Footer';
import { Header } from '../Header/Header';
import s from '../../App.module.scss';
import { ConfirmationModal } from '../ConfirmationModal/ConfirmationModal';
import { deleteBoard } from '../../services/boards';
import { useAppDispatch, useAppSelector } from '../../Redux/reduxHooks';
import { appSlice } from '../../Redux/toolkitSlice';
import { fetchBoards } from '../../Redux/actionCreators/fetchBoards';
import { ActionType } from '../../Redux/interfaces/initialState';
import { deleteColumnFromBoard } from '../../helpers/deleteColumn';
import { deleteColumn } from '../../services/columns';
import { getColumns } from '../../helpers/getColumns';
import { deleteTask } from '../../services/tasks';
import { filterByTasks } from '../../helpers/filterByTasks';

export const Layout = () => {
  const location = useLocation();
  const kanbanLocation = location.pathname.split('/')[2];
  const dispatch = useAppDispatch();
  const { setSelectedBoardId, setSelectedColumnId, setNewColumn, setSelectedTaskId } =
    appSlice.actions;
  const { boards, confirmationModal, currentBoard } = useAppSelector((state) => state.appReducer);
  const { board, selectedColumnId, currentBoardId, selectedTaskId } = currentBoard;
  const { selectedBoardId } = boards;
  const { type } = confirmationModal;

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
      default:
        return null;
    }
  };

  const getConfirmationModalText = () => {
    switch (type) {
      case ActionType.DELETE_BOARD:
        return 'You will remove the board and all of its contents.';
      case ActionType.DELETE_COLUMN:
        return 'You want to delete this column? All tasks will be deleted. This action cannot be undone.';
      case ActionType.DELETE_TASK:
        return 'You want to delete this task? This action cannot be undone.';
      default:
        return '';
    }
  };

  const text = getConfirmationModalText();
  const mainClasses = kanbanLocation
    ? `${s.main} ${s.wrapper} ${s.kanban}`
    : `${s.main} ${s.wrapper}`;

  return (
    <>
      <Header />
      <main className={mainClasses}>
        <Outlet />
        <ConfirmationModal text={text} onConfirm={handlePortalAction} />
      </main>
      <Footer />
    </>
  );
};
