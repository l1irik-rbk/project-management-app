import { useEffect } from 'react';

import { fetchBoards } from '../../Redux/actionCreators/fetchBoards';
import { useAppDispatch, useAppSelector } from '../../Redux/reduxHooks';
import { Boards } from './Components/Boards';
import { NewBoardField } from './Components/NewBoardField';

export const Main = () => {
  const { boards } = useAppSelector((state) => state.appReducer);
  const dispatch = useAppDispatch();
  const { newBoard } = boards;

  useEffect(() => {
    dispatch(fetchBoards());
  }, []);

  return (
    <>
      {newBoard && <NewBoardField />}
      <Boards />
    </>
  );
};
