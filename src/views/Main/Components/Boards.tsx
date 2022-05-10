import React from 'react';
import { useAppSelector } from '../../../Redux/reduxHooks';
import s from '../Main.module.scss';
import { Board } from './Board';

export const Boards = () => {
  const { boards } = useAppSelector((state) => state.appReducer);
  const { isBoardsLoaded, boardsArray } = boards;

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
