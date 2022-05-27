import { setBoard } from '../../Redux/slices/boardSlice';
import { updateColumn } from '../../services/columns';
import { FullBoard } from '../../services/interfaces/boards';
import { FullColumn } from '../../services/interfaces/columns';
import { Task } from '../../services/interfaces/tasks';
import { updateTask } from '../../services/tasks';

export const reorderColumns = (columns: FullColumn[], from: number, to: number) => {
  const oldColumns = [...columns];
  const [removed] = oldColumns.splice(from, 1);
  const formatRemoved = { ...removed, order: to };
  oldColumns.splice(to, 0, formatRemoved);
  const newOrderColumns = oldColumns.map((column, index) => ({
    ...column,
    order: index + 1,
  }));
  return newOrderColumns;
};

export const syncColumnOrderToServer = async (boardId: string, column: FullColumn, order: number) =>
  updateColumn(boardId, column.id, column.title, order);

export const reorderTasks = (tasks: Task[], from: number, to: number) => {
  const oldTasks = [...tasks];
  const [removed] = oldTasks.splice(from, 1);
  const formatRemoved = { ...removed, order: to };
  oldTasks.splice(to, 0, formatRemoved);
  const newOrderTasks = oldTasks.map((task, index) => ({ ...task, order: index + 1 }));
  return newOrderTasks;
};

export const syncTasksWithRedux = (board: FullBoard, column: FullColumn, tasks: Task[]) => {
  const updatedColumn = { ...column, tasks };
  const index = ({ ...board } as FullBoard).columns.findIndex((c) => c.id === column.id);
  const oldColumns = [...board.columns];
  const newColumns = oldColumns.map((c, i) => (i === index ? updatedColumn : c));
  const newBoard = { ...board, columns: [...newColumns] };
  return newBoard;
};

export const syncTaskOrderWithServer = async (
  task: Task,
  boardId: string,
  columnId: string,
  order: number
) => {
  const newOrderTask = await updateTask(boardId, columnId, { ...task, order });
  return newOrderTask;
};

export const syncTasksWithReduxBetweenColumns = (
  columns: FullColumn[],
  fromTasks: Task[],
  toTasks: Task[],
  fromColumnId: string,
  toColumnId: string
) => {
  const newOrderTasksFromColumn = fromTasks.map((item, index) => ({
    ...item,
    order: index + 1,
  }));
  const newOrderTasksToColumn = toTasks.map((item, index) => ({ ...item, order: index + 1 }));
  const newColumns = [...columns].map((column) => {
    if (column.id === fromColumnId) return { ...column, tasks: newOrderTasksFromColumn };
    if (column.id === toColumnId) return { ...column, tasks: newOrderTasksToColumn };
    return column;
  });
  return newColumns as FullColumn[];
};
