import { useAppSelector } from '../../../Redux/hooks';

import s from '../Main.module.scss';
import { Board } from './Board';

export const Boards = () => {
  const { boardsArray } = useAppSelector((state) => state.boards);
  if (!boardsArray) return null;

  return (
    <div className={`${s.boards}`}>
      {boardsArray.map((board) => (
        <Board key={board.id} id={board.id} title={board.title} />
      ))}
    </div>
  );
};
