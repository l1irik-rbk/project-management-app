import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';

import { getBoard } from '../../services/boards';
import { FullBoard } from '../../services/interfaces/boards';
import { Column } from './components/Column/Column';
import { CreateColumnButton } from './components/CreateColumnButton/CreateColumnButton';
import s from './Kanban.module.scss';

export const Kanban = () => {
  const params = useParams();
  const [board, setBoard] = useState<FullBoard | null>(null);
  const [isBoardLoaded, setBoardLoaded] = useState(false);
  const orderForNewColumn = board?.columns.length || 0;
  console.log(board);
  useEffect(() => {
    if (board) document.title = `${board.title}`;

    setBoardData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const setBoardData = async () => {
    if (params.id) {
      const board = await getBoard(params.id);
      setBoard(board);
      setBoardLoaded(true);
    }
  };

  return (
    <>
      {!params.id && <Navigate to="/" />}
      {isBoardLoaded ? (
        <div className={s.content}>
          {board?.columns
            ?.sort((a, b) => a.order - b.order)
            .map(
              (column) =>
                params.id && <Column key={column.id} column={column} boardId={params.id} />
            )}

          <CreateColumnButton
            boardId={params.id}
            orderForNewColumn={orderForNewColumn}
            onCreateColumn={setBoardData}
          />
        </div>
      ) : (
        <div>LOADING...</div>
      )}
    </>
  );
};
