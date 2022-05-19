import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';

import s from './Kanban.module.scss';
import { Spinner } from '../../components/Spinner/Spinner';
import { fetchBoard } from '../../Redux/actionCreators/fetchBoard';
import { useAppDispatch, useAppSelector } from '../../Redux/reduxHooks';
import { boardSlice, setBoard, setCurrentBoardId } from '../../Redux/slices/boardSlice';
import { Column } from './components/Column/Column';
import { CreateColumnButton } from './components/CreateColumnButton/CreateColumnButton';
import { updateColumn } from '../../services/columns';
import { updateTask } from '../../services/tasks';
import type { FullColumn } from '../../services/interfaces/columns';
import type { Task } from '../../services/interfaces/tasks';
import type { FullBoard } from '../../services/interfaces/boards';

export const Kanban = () => {
  const navigate = useNavigate();
  const paramId = useParams().id;

  const dispatch = useAppDispatch();
  const boards = useAppSelector((state) => state.boards);
  const board = useAppSelector((state) => state.board.board);
  const { currentBoardId, isBoardLoaded } = useAppSelector((state) => state.board);
  const { setNewColumns } = boardSlice.actions;

  const orderForNewColumn = board?.columns.length || 0;
  const columns = board?.columns.slice().sort((a, b) => a.order - b.order);

  useEffect(() => {
    if (!paramId) return;

    const isTrueBoardId = boards.boardsArray.map((item) => item.id).includes(paramId);
    if (!isTrueBoardId) navigate('/');

    if (paramId !== currentBoardId) {
      dispatch(setCurrentBoardId(paramId));
      dispatch(fetchBoard(paramId));
    } else document.title = `${board && board.title} | KanbanBoar`;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramId, board]);

  const handleDragEnd = async (result: DropResult) => {
    // https://codesandbox.io/s/nested-dnd-across-parent-forked-bhvm51?file=/index.js:1415-1426
    const { source, destination, type } = result;
    if (!destination) return;
    if (!columns) return;

    const fromIndex = source.index;
    const toIndex = destination.index;

    const fromParentId = source.droppableId;
    const toParentId = destination.droppableId;

    if (type === 'column') {
      if (fromIndex === toIndex) return;

      const newColumns = Array.from(columns);
      const [removed] = newColumns.splice(fromIndex, 1);
      newColumns.splice(toIndex, 0, removed);
      const newOrders = newColumns.map((item, index) => ({ ...item, order: index }));
      dispatch(setNewColumns(newOrders));
      await syncColumnsOrderWithServer(newOrders);
    }

    if (type === 'task') {
      const fromColumnId = fromParentId;
      const toColumnId = toParentId;
      const currentColumn = columns.find((column) => column.id === fromColumnId);
      const tasks = currentColumn?.tasks.slice().sort((a, b) => a.order - b.order);

      if (fromParentId === toColumnId) {
        if (!tasks || !currentColumn || !currentBoardId) return;

        const reorderedTasks = reorderTasks(tasks, fromIndex, toIndex);
        syncTasksWithRedux(currentColumn, reorderedTasks);
        syncTasksOrderWithServer(tasks, reorderedTasks, currentBoardId, currentColumn.id);
      }

      if (fromParentId !== toColumnId) {
        const toColumn = columns.find((column) => column.id === toColumnId);
        if (!currentColumn || !toColumn || !tasks || !currentBoardId) return;

        const fromTasks = [...tasks];
        const toTasks = [...toColumn?.tasks];

        const [draggedItem] = fromTasks.splice(fromIndex, 1);

        toTasks.splice(toIndex, 0, draggedItem);
        const newOrderTasksFromColumn = fromTasks.map((item, index) => ({ ...item, order: index }));
        const newOrderTasksToColumn = toTasks.map((item, index) => ({ ...item, order: index }));
        const newColumns = [...columns].map((column) => {
          if (column.id === fromColumnId) return { ...column, tasks: newOrderTasksFromColumn };
          if (column.id === toColumnId) return { ...column, tasks: newOrderTasksToColumn };
          return column;
        });

        dispatch(setNewColumns(newColumns));

        // TODO: фиксить или нет, вот в чем вопрос
        // апдейтом не получается изменить айди колонки на другую
        // возвращает 404 ошибку
        // await updateTask(currentBoardId, toColumn.id, {
        //   ...draggedItem,
        // });
      }
    }
  };

  const syncTasksOrderWithServer = (
    oldTasks: Task[],
    newTasks: Task[],
    boardId: string,
    columnId: string
  ) => {
    const syncOneTasWithServer = async (task: Task) => updateTask(boardId, columnId, task);

    const filterTasks = newTasks.filter((task, index) => task.id !== oldTasks[index].id);
    const promises = filterTasks.map((task) => syncOneTasWithServer(task));
    return Promise.all(promises);
  };

  const syncTasksWithRedux = (column: FullColumn, tasks: Task[]) => {
    if (!board) return;

    const updatedColumn = { ...column, tasks };
    const index = ({ ...board } as FullBoard).columns.findIndex((c) => c.id === column.id);
    const oldColumns = [...board.columns];
    const newColumns = oldColumns.map((c, i) => (i === index ? updatedColumn : c));
    const newBoard = { ...board, columns: [...newColumns] };

    dispatch(setBoard(newBoard as FullBoard));
  };

  const reorderTasks = (tasks: Task[], from: number, to: number) => {
    const oldTasks = [...tasks];
    const [removed] = oldTasks.splice(from, 1);
    const formatRemoved = { ...removed, order: to };
    oldTasks.splice(to, 0, formatRemoved);
    const newOrderTasks = oldTasks.map((task, index) => ({ ...task, order: index }));
    return newOrderTasks;
  };

  const syncColumnsOrderWithServer = async (newColumns: FullColumn[]) => {
    if (!currentBoardId || !columns) return;
    const syncColumnOrderToServer = async (column: FullColumn) =>
      updateColumn(currentBoardId, column.id, column.title, column.order);

    const makeColumnsOrderIsUnique = newColumns.map((item, index) => ({
      ...item,
      order: index + 100,
    }));
    const uniqueOrder = makeColumnsOrderIsUnique.map((column) => syncColumnOrderToServer(column));
    await Promise.all(uniqueOrder);

    const newColumnsOrder = newColumns.map((column) => syncColumnOrderToServer(column));
    return Promise.all(newColumnsOrder);
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

                {currentBoardId && (
                  <CreateColumnButton
                    boardId={currentBoardId}
                    orderForNewColumn={orderForNewColumn}
                  />
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
