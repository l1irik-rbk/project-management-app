import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { getColumns } from '../../helpers/getColumns';
import { fetchBoard } from '../../Redux/actionCreators/fetchBoard';
import { useAppDispatch, useAppSelector } from '../../Redux/reduxHooks';
import { appSlice } from '../../Redux/toolkitSlice';

import { Column } from './components/Column/Column';
import { CreateColumnButton } from './components/CreateColumnButton/CreateColumnButton';
import s from './Kanban.module.scss';

export const Kanban = () => {
  const params = useParams();
  const boardId = params.id;
  const dispatch = useAppDispatch();
  const { setCurrentBoardId } = appSlice.actions;
  const { currentBoard } = useAppSelector((state) => state.appReducer);
  const { board, isBoardLoaded } = currentBoard;
  const orderForNewColumn = board?.columns.length || 0;
  const columns = board ? getColumns(board) : null;

  useEffect(() => {
    if (board) document.title = `${board.title}`;
    if (boardId) {
      dispatch(fetchBoard(boardId));
      dispatch(setCurrentBoardId(boardId));
    }

    return () => {
      dispatch(setCurrentBoardId(null));
    };
  }, [boardId]);

  return (
    <>
      {!boardId && <Navigate to="/" />}
      {isBoardLoaded ? (
        <div className={s.content}>
          {columns
            ?.sort((a, b) => a.order - b.order)
            .map(
              (column) => boardId && <Column key={column.id} column={column} boardId={boardId} />
            )}

          <CreateColumnButton boardId={boardId} orderForNewColumn={orderForNewColumn} />
        </div>
      ) : (
        <div>LOADING...</div>
      )}
    </>
  );
};
