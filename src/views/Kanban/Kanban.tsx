import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import s from './Kanban.module.scss';
import { Spinner } from '../../components/Spinner/Spinner';
import { fetchBoard } from '../../Redux/actionCreators/fetchBoard';
import { useAppDispatch, useAppSelector } from '../../Redux/reduxHooks';
import { setCurrentBoardId } from '../../Redux/slices/boardSlice';
import { Column } from './components/Column/Column';
import { CreateColumnButton } from './components/CreateColumnButton/CreateColumnButton';

export const Kanban = () => {
  const navigate = useNavigate();
  const paramId = useParams().id;

  const dispatch = useAppDispatch();
  const boards = useAppSelector((state) => state.boards);
  const board = useAppSelector((state) => state.board.board);
  const boardId = useAppSelector((state) => state.board.currentBoardId);
  const isBoardLoaded = useAppSelector((state) => state.board.isBoardLoaded);
  const columns = board?.columns.slice().sort((a, b) => a.order - b.order);

  const orderForNewColumn = board?.columns.length;

  useEffect(() => {
    if (!paramId) return;

    const isTrueBoardId = paramId && boards.boardsArray.map((item) => item.id).includes(paramId);
    if (!isTrueBoardId) navigate('/');

    if (board) document.title = `${board.title}`;
    if (paramId !== boardId) {
      dispatch(setCurrentBoardId(paramId));
      dispatch(fetchBoard(paramId));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramId]);

  return (
    <>
      {isBoardLoaded && columns ? (
        <div className={s.content}>
          {columns.map((column) => (
            <Column key={column.id} columnId={column.id} column={column} />
          ))}

          {boardId && orderForNewColumn && (
            <CreateColumnButton boardId={boardId} orderForNewColumn={orderForNewColumn} />
          )}
        </div>
      ) : (
        <Spinner />
      )}
    </>
  );
};
