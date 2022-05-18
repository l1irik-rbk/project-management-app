import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';

import s from './Kanban.module.scss';
import { Spinner } from '../../components/Spinner/Spinner';
import { fetchBoard } from '../../Redux/actionCreators/fetchBoard';
import { useAppDispatch, useAppSelector } from '../../Redux/reduxHooks';
import { setBoard, setCurrentBoardId } from '../../Redux/slices/boardSlice';
import { Column } from './components/Column/Column';
import { CreateColumnButton } from './components/CreateColumnButton/CreateColumnButton';
import { FullColumn } from '../../services/interfaces/columns';
import { updateColumn } from '../../services/columns';

export const Kanban = () => {
  const navigate = useNavigate();
  const paramId = useParams().id;

  const dispatch = useAppDispatch();
  const boards = useAppSelector((state) => state.boards);
  const board = useAppSelector((state) => state.board.board);
  const boardId = useAppSelector((state) => state.board.currentBoardId);
  const isBoardLoaded = useAppSelector((state) => state.board.isBoardLoaded);

  const orderForNewColumn = board?.columns.length;
  const columns = board?.columns.slice().sort((a, b) => a.order - b.order);

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

  const handleDragEnd = async (result: DropResult) => {
    // https://codesandbox.io/s/nested-dnd-across-parent-forked-bhvm51?file=/index.js:1415-1426
    // TODO: 1) баг на таче при перетаскивании колонок, начинается перенос таска и колонки
    // TODO: 2) баг не всегда получается комфортно взять таск

    const { source, destination } = result;
    if (!destination) return;
    if (!columns) return;

    const items = Array.from(columns);

    const from = source.index;
    const to = destination.index;
    if (from === to) return;

    const [removed] = items.splice(from, 1);
    const formatRemoved = { ...removed, order: to };
    items.splice(to, 0, formatRemoved);
    const newOrders = items.map((item, index) => ({ ...item, order: index }));

    syncWithRedux(newOrders);
    await syncOrderToServer(newOrders);
  };

  const syncWithRedux = (columns: FullColumn[]) => {
    if (!board) return;

    const newBoard = { ...board, columns };
    dispatch(setBoard(newBoard));
  };

  const syncOrderToServer = async (newColumns: FullColumn[]) => {
    if (!boardId || !columns) return;
    const syncColumnOrderToServer = async (column: FullColumn) =>
      updateColumn(boardId, column.id, column.title, column.order);

    // const filterColumns = newColumns.filter((column, index) => column.id !== columns[index].id);
    const promises = newColumns.map((column) => syncColumnOrderToServer(column));
    return Promise.all(promises);
    // TODO: сервер возвращает 500 код если order изменился и 204 если остался прежним. Где проблема?
  };

  return (
    <>
      {isBoardLoaded && columns ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="board" type="column" direction="horizontal">
            {(provided) => (
              <div className={s.content} {...provided.droppableProps} ref={provided.innerRef}>
                {columns.map((column, index) => (
                  <Draggable key={column.id} draggableId={column.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Column key={column.id} columnId={column.id} column={column} />
                      </div>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}

                {boardId && orderForNewColumn && (
                  <CreateColumnButton boardId={boardId} orderForNewColumn={orderForNewColumn} />
                )}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <Spinner />
      )}
    </>
  );
};
