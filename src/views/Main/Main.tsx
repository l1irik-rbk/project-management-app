import { useEffect } from 'react';

import { fetchBoards } from '../../Redux/actionCreators/fetchBoards';
import { useAppDispatch, useAppSelector } from '../../Redux/reduxHooks';
import { Boards } from './components/Boards';
import { NewBoardField } from './components/NewBoardField';

export const Main = () => {
  const { boards } = useAppSelector((state) => state.appReducer);
  const dispatch = useAppDispatch();
  const { newBoard, isBoardsLoaded } = boards;

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
