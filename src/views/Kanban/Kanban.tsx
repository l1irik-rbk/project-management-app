import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useAppDispatch } from '../../Redux/reduxHooks';
import { setBoardId } from '../../Redux/toolkitSlice';

import { getBoard, getBoards } from '../../services/boards';
import { FullBoard } from '../../services/interfaces/boards';
import { Column } from './components/Column/Column';
import { CreateColumnButton } from './components/CreateColumnButton/CreateColumnButton';
import s from './Kanban.module.scss';

export const Kanban = () => {
  const params = useParams();
  const [isTrueId, setIsTrueId] = useState(true);
  const [board, setBoard] = useState<FullBoard | null>(null);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const findBoard = async () => {
      const boards = await getBoards();
      if (Array.isArray(boards)) setIsTrueId(!!boards.find((board) => board.id === params.id));
      else setIsTrueId(false);
    };
    findBoard();

    if (isTrueId && params.id) dispatch(setBoardId(params.id));

    const setBoardData = async () => {
      if (params.id) {
        const board = await getBoard(params.id);
        setBoard(board);
      }
    };
    setBoardData();
  }, [params.id]);

  return (
    <>
      {(!params.id || !isTrueId) && <Navigate to="/" />}
      <h2>{board?.title}</h2>

      <div className={s.content}>
        {board?.columns
          ?.sort((a, b) => a.order - b.order)
          .map((column) => (
            <Column key={column.id} column={column} />
          ))}
        <CreateColumnButton />
      </div>
    </>
  );
};
