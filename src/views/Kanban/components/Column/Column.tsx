import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';

import { FullColumn, Task as TaskType } from '../../../../services/interfaces/columns';
import { CreateTaskButton } from '../CreateTaskButton/CreateTaskButton';
import { Task } from '../Task/Task';
import s from './Column.module.scss';
import { ColumnTitle } from '../ColumnTitle/ColumnTitle';
import { updateTask } from '../../../../services/tasks';
import { useAppDispatch, useAppSelector } from '../../../../Redux/reduxHooks';
import { FullBoard } from '../../../../services/interfaces/boards';
import { setBoard } from '../../../../Redux/slices/boardSlice';

type ColumnProps = {
  column: FullColumn;
  columnId: string;
};

export function Column(props: ColumnProps) {
  const dispatch = useAppDispatch();
  const column = useAppSelector(
    (s) => s.board.board && s.board.board.columns.find((c) => c.id === props.columnId)
  ) as FullColumn;
  const board = useAppSelector((s) => s.board.board);
  const boardId = useAppSelector((state) => state.board.currentBoardId) as string;
  const tasks = column.tasks.slice().sort((a, b) => a.order - b.order);
  const orderForNewTask = column.tasks.length;

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (!tasks) return;

    const items = Array.from(tasks);

    const from = source.index;
    const to = destination.index;
    if (from === to) return;

    const [removed] = items.splice(from, 1);
    const formatRemoved = { ...removed, order: to };
    items.splice(to, 0, formatRemoved);
    const newOrdersTasks = items.map((item, index) => ({ ...item, order: index }));

    syncTasksWithRedux(newOrdersTasks);
    await syncTasksOrderToServer(newOrdersTasks);
  };

  const syncTasksOrderToServer = (tasks: TaskType[]) => {
    // TODO: если ордер тасок изменился, то нужно обновить их в базе, а сейчас обновляются все
    const syncOneTaskOrderToServer = async (task: TaskType) => updateTask(boardId, column.id, task);
    const allTasks = tasks.map((task) => syncOneTaskOrderToServer(task));
    const updatedTasks = Promise.all(allTasks);

    return updatedTasks;
  };

  const syncTasksWithRedux = (tasks: TaskType[]) => {
    if (!board) return;

    const updatedColumn = { ...column, tasks };
    const index = ({ ...board } as FullBoard).columns.findIndex((c) => c.id === column.id);
    const oldColumns = [...board.columns];
    const newColumns = oldColumns.map((c, i) => (i === index ? updatedColumn : c));
    const newBoard = { ...board, columns: [...newColumns] };

    dispatch(setBoard(newBoard as FullBoard));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="todo">
        {(provided) => (
          <div className={s.column} {...provided.droppableProps} ref={provided.innerRef}>
            <ColumnTitle
              taskLength={tasks.length}
              title={column.title}
              columnId={column.id}
              boardId={boardId}
            />

            {tasks.map((task, index) => {
              return (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Task key={task.id} boardId={boardId} columnId={column.id} task={task} />
                    </div>
                  )}
                </Draggable>
              );
            })}

            {provided.placeholder}

            <CreateTaskButton
              boardId={boardId}
              columnId={column.id}
              orderForNewTask={orderForNewTask}
              onCreateTask={() => {}}
            />
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
