import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';

import s from './Kanban.module.scss';
import { Spinner } from '../../components/Spinner/Spinner';
import { useAppDispatch, useAppSelector } from '../../Redux/hooks';
import { boardSlice, fetchBoard, setBoard, setCurrentBoardId } from '../../Redux/slices/boardSlice';
import { Column } from './components/Column/Column';
import { CreateColumnButton } from './components/CreateColumnButton/CreateColumnButton';
import { updateTask } from '../../services/tasks';
import type { FullColumn } from '../../services/interfaces/columns';
import type { Task } from '../../services/interfaces/tasks';
import type { FullBoard } from '../../services/interfaces/boards';
import { syncColumnsOrderWithServer } from './components/utils';

export const Kanban = () => {
  const navigate = useNavigate();
  const paramId = useParams().id;

  const dispatch = useAppDispatch();
  const boards = useAppSelector((state) => state.boards.boardsArray);
  const board = useAppSelector((state) => state.board.board);
  const columns = board?.columns.slice();

  const { currentBoardId, isBoardLoaded } = useAppSelector((state) => state.board);
  const { setColumns } = boardSlice.actions;

  useEffect(() => {
    if (!paramId) return;

    const isTrueBoardId = boards?.map((item) => item.id).includes(paramId);
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
      if (fromIndex === toIndex || !currentBoardId) return;

      const newOrders = reorderColumns(columns, fromIndex, toIndex);
      dispatch(setColumns(newOrders));
      await syncColumnsOrderWithServer(newOrders, currentBoardId);
    }

    if (type === 'task') {
      const fromColumnId = fromParentId;
      const toColumnId = toParentId;
      const currentColumn = columns.find((column) => column.id === fromColumnId);
      const tasks = currentColumn?.tasks.slice();

      if (fromParentId === toColumnId) {
        if (!tasks || !currentColumn || !currentBoardId) return;

        const reorderTasks = (tasks: Task[], from: number, to: number) => {
          const oldTasks = [...tasks];
          const [removed] = oldTasks.splice(from, 1);
          const formatRemoved = { ...removed, order: to };
          oldTasks.splice(to, 0, formatRemoved);
          const newOrderTasks = oldTasks.map((task, index) => ({ ...task, order: index + 1 }));
          return newOrderTasks;
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

        const syncTaskOrderWithServer = async (
          task: Task,
          boardId: string,
          columnId: string,
          toIndex: number
        ) => {
          const newOrderTask = await updateTask(boardId, columnId, { ...task, order: toIndex + 1 });
          return newOrderTask;
        };

        const reorderedTasks = reorderTasks(tasks, fromIndex, toIndex);
        reorderedTasks.map((task) => console.log(task.title, task.order));
        syncTasksWithRedux(currentColumn, reorderedTasks);

        const taskTransmitted = tasks[fromIndex];
        await syncTaskOrderWithServer(taskTransmitted, currentBoardId, currentColumn.id, toIndex);
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

        dispatch(setColumns(newColumns));
      }
    }
  };

  const reorderColumns = (columns: FullColumn[], from: number, to: number) => {
    const oldColumns = [...columns];
    const [removed] = oldColumns.splice(from, 1);
    const formatRemoved = { ...removed, order: to };
    oldColumns.splice(to, 0, formatRemoved);
    const newOrderColumns = oldColumns.map((column, index) => ({ ...column, order: index }));

    return newOrderColumns;
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

                {currentBoardId && <CreateColumnButton boardId={currentBoardId} />}
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
