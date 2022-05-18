import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';

import s from './Kanban.module.scss';
import { Spinner } from '../../components/Spinner/Spinner';
import { fetchBoard } from '../../Redux/actionCreators/fetchBoard';
import { useAppDispatch, useAppSelector } from '../../Redux/reduxHooks';
import { boardSlice, setCurrentBoardId } from '../../Redux/slices/boardSlice';
import { Column } from './components/Column/Column';
import { CreateColumnButton } from './components/CreateColumnButton/CreateColumnButton';
import { FullColumn } from '../../services/interfaces/columns';
import { updateColumn } from '../../services/columns';
import { reorder } from '../../helpers/reorder';
import { keysToSameValueAsKeys } from '../../helpers/keysToSameValueAsKeys';

export const Kanban = () => {
  const navigate = useNavigate();
  const paramId = useParams().id;

  const dispatch = useAppDispatch();
  const boards = useAppSelector((state) => state.boards);
  const board = useAppSelector((state) => state.board.board);
  const boardId = useAppSelector((state) => state.board.currentBoardId);
  const isBoardLoaded = useAppSelector((state) => state.board.isBoardLoaded);
  const { setNewColumns } = boardSlice.actions;

  const orderForNewColumn = board?.columns.length || 0;
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
    const { source, destination, type } = result;
    if (!destination) return;
    if (!columns) return;

    const fromColumn = source.index;
    const toColumn = destination.index;

    if (type === 'column') {
      if (fromColumn === toColumn) return;
      const newColumns = Array.from(columns);
      const [removed] = newColumns.splice(fromColumn, 1);
      newColumns.splice(toColumn, 0, removed);
      const newOrders = newColumns.map((item, index) => ({ ...item, order: index }));
      dispatch(setNewColumns(newOrders));
      await syncOrderToServer(newOrders);
    } else if (type === 'task') {
      const itemSubItemMap = keysToSameValueAsKeys(columns);

      const fromParentId = source.droppableId;
      const toParentId = destination.droppableId;

      const fromTasks = itemSubItemMap[fromParentId];
      const toTasks = itemSubItemMap[toParentId];

      if (fromParentId === toParentId) {
        const reorderedTasks = reorder(fromTasks, fromColumn, toColumn);
        const newOrdersTasks = reorderedTasks.map((item, index) => ({ ...item, order: index }));

        let newColumns = Array.from(columns);
        newColumns = newColumns.map((item) => {
          const newItem = { ...item };
          if (item.id === fromParentId) {
            newItem.tasks = newOrdersTasks;
          }
          return newItem;
        });
        dispatch(setNewColumns(newColumns));
      } else {
        const newToTasks = [...toTasks];
        const newFromTasks = [...fromTasks];

        const [draggedItem] = newFromTasks.splice(fromColumn, 1);
        newToTasks.splice(toColumn, 0, draggedItem);

        const newOrdersTasks = newToTasks.map((item, index) => ({ ...item, order: index }));

        let newItems = Array.from(columns);
        newItems = newItems.map((item) => {
          const newItem = { ...item };
          if (newItem.id === fromParentId) {
            newItem.tasks = newFromTasks;
          } else if (newItem.id === toParentId) {
            newItem.tasks = newOrdersTasks;
          }
          return newItem;
        });

        dispatch(setNewColumns(newItems));
      }
    }
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

                {boardId && (
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
