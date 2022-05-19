import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';

import s from './Kanban.module.scss';
import { Spinner } from '../../components/Spinner/Spinner';
import { fetchBoard } from '../../Redux/actionCreators/fetchBoard';
import { useAppDispatch, useAppSelector } from '../../Redux/reduxHooks';
import { boardSlice, setBoard, setCurrentBoardId } from '../../Redux/slices/boardSlice';
import { Column } from './components/Column/Column';
import { Column as ColumnType } from './../../services/interfaces/columns';
import { CreateColumnButton } from './components/CreateColumnButton/CreateColumnButton';
import { FullColumn } from '../../services/interfaces/columns';
import { updateColumn } from '../../services/columns';
import { Task } from '../../services/interfaces/tasks';
import { FullBoard } from '../../services/interfaces/boards';
import { updateTask } from '../../services/tasks';

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
    const isTrueBoardId = paramId && boards.boardsArray.map((item) => item.id).includes(paramId);
    if (!isTrueBoardId) navigate('/');
    if (board) document.title = `${board.title}`;
    if (paramId !== currentBoardId) {
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

    const fromParentId = source.droppableId;
    const toParentId = destination.droppableId;

    const fromIndex = source.index;
    const toIndex = destination.index;

    if (type === 'column') {
      if (fromColumn === toColumn) return;
      const newColumns = Array.from(columns);
      const [removed] = newColumns.splice(fromColumn, 1);
      newColumns.splice(toColumn, 0, removed);
      const newOrders = newColumns.map((item, index) => ({ ...item, order: index }));
      dispatch(setNewColumns(newOrders));
      // await syncOrderToServer(newOrders);
    }

    if (type === 'task') {
      const fromColumnId = source.droppableId;
      const toColumnId = destination.droppableId;
      const currentColumn = columns.find((column) => column.id === fromColumnId);

      if (fromParentId === toColumnId) {
        const tasks = currentColumn?.tasks.slice().sort((a, b) => a.order - b.order);
        if (!tasks || !currentColumn || !currentBoardId) return;

        const reorderedTasks = reorderTasks(tasks, fromIndex, toIndex);
        syncTasksWithRedux(currentColumn, reorderedTasks);
        syncTasksOrderWithServer(tasks, reorderedTasks, currentBoardId, currentColumn.id);
      }

      // const itemSubItemMap = keysToSameValueAsKeys(columns);
      // const fromTasks = itemSubItemMap[fromParentId];
      // const toTasks = itemSubItemMap[toParentId];

      if (fromParentId !== toColumnId) {
        const toColumn = columns.find((column) => column.id === toColumnId);
        console.log(toColumn);

        // const newToTasks = [...toTasks];
        // const newFromTasks = [...fromTasks];

        // const [draggedItem] = newFromTasks.splice(fromColumn, 1);
        // newToTasks.splice(toColumn, 0, draggedItem);
        // const newOrdersTasks = newToTasks.map((item, index) => ({ ...item, order: index }));
        // let newItems = Array.from(columns);
        // newItems = newItems.map((item) => {
        //   const newItem = { ...item };
        //   if (newItem.id === fromParentId) {
        //     newItem.tasks = newFromTasks;
        //   } else if (newItem.id === toParentId) {
        //     newItem.tasks = newOrdersTasks;
        //   }
        //   return newItem;
        // });
        // dispatch(setNewColumns(newItems));
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

  const syncColumnsOrderWithServer = async (newColumns: FullColumn[], plus: number) => {
    if (!currentBoardId || !columns) return;

    // console.log(newColumns);
    // const syncColumnOrderToServer = async (column: FullColumn) =>
    //   updateColumn(currentBoardId, column.id, column.title, column.order);

    // // const filterColumns = newColumns.filter((column, index) => column.id !== columns[index].id);
    // const promises = newColumns.map((column) => syncColumnOrderToServer(column));
    // return Promise.all(promises);
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
