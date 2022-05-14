import { useEffect } from 'react';
import { fetchBoards } from '../../../Redux/actionCreators/fetchBoards';
import { useAppDispatch, useAppSelector } from '../../../Redux/reduxHooks';
import { appSlice } from '../../../Redux/toolkitSlice';
import { deleteBoard } from '../../../services/boards';
import s from '../Main.module.scss';
import { Board } from './Board';

export const Boards = () => {
  const { boards, confirmationModal } = useAppSelector((state) => state.appReducer);
  const { isBoardsLoaded, boardsArray, selectedBoardId } = boards;
  const { isConfirmed } = confirmationModal;
  const dispatch = useAppDispatch();
  const { setSelectedBoardId, setIsConfirmed } = appSlice.actions;

  useEffect(() => {
    if (isConfirmed) {
      updatesBoards();
    }
  }, [isConfirmed]);

  const updatesBoards = async () => {
    await deleteBoard(selectedBoardId);
    dispatch(fetchBoards());
    dispatch(setSelectedBoardId(''));
    dispatch(setIsConfirmed(false));
  };

  return isBoardsLoaded ? (
    <div className={`${s.boards}`}>
      {boardsArray.map((board) => (
        <Board key={board.id} id={board.id} boardTitle={board.title} />
      ))}
    </div>
  ) : (
    <div>LOADING...</div>
  );
};
