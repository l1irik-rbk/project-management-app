import { Outlet } from 'react-router-dom';

import { Footer } from '../Footer/Footer';
import { Header } from '../Header/Header';
import s from '../../App.module.scss';
import { ConfirmationModal } from '../ConfirmationModal/ConfirmationModal';
import { deleteBoard } from '../../services/boards';
import { useAppDispatch, useAppSelector } from '../../Redux/reduxHooks';
import { appSlice } from '../../Redux/toolkitSlice';
import { fetchBoards } from '../../Redux/actionCreators/fetchBoards';
import { ActionType } from '../../Redux/interfaces/initialState';

export const Layout = () => {
  const dispatch = useAppDispatch();
  const { setSelectedBoardId } = appSlice.actions;
  const { boards, confirmationModal } = useAppSelector((state) => state.appReducer);
  const { selectedBoardId } = boards;
  const { type } = confirmationModal;

  const handlePortalAction = async () => {
    // switch (type) {
    //   case ActionType.DELETE_BOARD:
    //     await deleteBoard(selectedBoardId);
    //     dispatch(fetchBoards());
    //     dispatch(setSelectedBoardId(''));
    //     break;
    //   case ActionType.DELETE_COLUMN:
    //     break;
    //   default:
    //     return null;
    // }
  };

  const getConfirmationModalText = () => {
    switch (type) {
      case ActionType.DELETE_BOARD:
        return 'You will remove the board and all of its contents.';
      case ActionType.DELETE_COLUMN:
        return 'You want to delete this column? All tasks will be deleted. This action cannot be undone.';
      default:
        return '';
    }
  };

  const text = getConfirmationModalText();

  return (
    <>
      <Header />
      <main className={`${s.main} ${s.wrapper}`}>
        <Outlet />
        <ConfirmationModal text={text} onConfirm={handlePortalAction} />
      </main>
      <Footer />
    </>
  );
};
