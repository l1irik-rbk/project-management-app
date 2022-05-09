import { createAsyncThunk } from '@reduxjs/toolkit';
import React, { useEffect } from 'react';
import ModalWindow from '../../components/Portal/ModalWindow';
import { Portal } from '../../components/Portal/Portal';
import { useAppDispatch, useAppSelector } from '../../Redux/reduxHooks';
import { getBoards } from '../../services/boards';
import { Boards } from './Components/Boards';
import { NewBoardField } from './Components/NewBoardField';

export const fetchBoards = createAsyncThunk('fetchBoards', async (token: string) => {
  const boards = await getBoards(token);
  console.log(boards);
  return boards;
});

export const Main = () => {
  const { token, boards } = useAppSelector((state) => state.appReducer);
  const dispatch = useAppDispatch();
  const { newBoard } = boards;

  useEffect(() => {
    if (token) dispatch(fetchBoards(token));
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
