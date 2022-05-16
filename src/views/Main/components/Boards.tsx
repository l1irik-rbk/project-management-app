import { useAppSelector } from '../../../Redux/reduxHooks';

import s from '../Main.module.scss';
import { Board } from './Board';

export const Boards = () => {
  const { isBoardsLoaded, boardsArray } = useAppSelector((state) => state.boards);

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
