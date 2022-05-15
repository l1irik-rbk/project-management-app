import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { getColumns } from '../../helpers/getColumns';
import { fetchBoard } from '../../Redux/actionCreators/fetchBoard';
import { useAppDispatch, useAppSelector } from '../../Redux/reduxHooks';

import { Column } from './components/Column/Column';
import { CreateColumnButton } from './components/CreateColumnButton/CreateColumnButton';
import s from './Kanban.module.scss';

export const Kanban = () => {
  const params = useParams();
  const dispatch = useAppDispatch();
  const { currentBoard } = useAppSelector((state) => state.appReducer);
  const { board, isBoardLoaded } = currentBoard;
  const orderForNewColumn = board?.columns.length || 0;

  const columns = board ? getColumns(board) : null;

  useEffect(() => {
    if (board) document.title = `${board.title}`;
    if (params.id) dispatch(fetchBoard(params.id));
    console.log(board);
  }, [params.id]);

  return (
    <>
      {!params.id && <Navigate to="/" />}
      {isBoardLoaded ? (
        <div className={s.content}>
          {columns
            ?.sort((a, b) => a.order - b.order)
            .map(
              (column) =>
                params.id && <Column key={column.id} column={column} boardId={params.id} />
            )}

          <CreateColumnButton boardId={params.id} orderForNewColumn={orderForNewColumn} />
        </div>
      ) : (
        <div>LOADING...</div>
      )}
    </>
  );
};
