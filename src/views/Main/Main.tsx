import React, { useEffect } from 'react';

import ModalWindow from '../../components/Portal/ModalWindow';
import { Portal } from '../../components/Portal/Portal';
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
      <Portal>
        <ModalWindow />
      </Portal>
    </>
  );
};
