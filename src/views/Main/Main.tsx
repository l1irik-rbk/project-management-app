import { useEffect } from 'react';

import { fetchBoards } from '../../Redux/actionCreators/fetchBoards';
import { useAppDispatch, useAppSelector } from '../../Redux/reduxHooks';
import { Boards } from './components/Boards';
import { CreateNewBoard } from './components/CreateNewBoard';

export const Main = () => {
  const { newBoard, isBoardsLoaded } = useAppSelector((state) => state.boards);
  const dispatch = useAppDispatch();

  useEffect(() => {
    document.title = `${'Boards'} | KanbanBoar`;

    if (!isBoardsLoaded) {
      dispatch(fetchBoards());
    }
  }, [dispatch, isBoardsLoaded]);

  return (
    <>
      {newBoard && <CreateNewBoard />}
      <Boards />
    </>
  );
};
