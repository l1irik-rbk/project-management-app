import { useEffect } from 'react';

import { fetchBoards } from '../../Redux/actionCreators/fetchBoards';
import { useAppDispatch, useAppSelector } from '../../Redux/reduxHooks';
import { Boards } from './components/Boards';
import { NewBoardField } from './components/NewBoardField';

export const Main = () => {
  const { newBoard, isBoardsLoaded } = useAppSelector((state) => state.boards);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isBoardsLoaded) {
      dispatch(fetchBoards());
    }
  }, []);

  return (
    <>
      {newBoard && <NewBoardField />}
      <Boards />
    </>
  );
};
