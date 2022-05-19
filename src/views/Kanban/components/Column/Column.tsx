import { Draggable, Droppable } from 'react-beautiful-dnd';

import { FullColumn } from '../../../../services/interfaces/columns';
import { CreateTaskButton } from '../CreateTaskButton/CreateTaskButton';
import { Task } from '../Task/Task';
import s from './Column.module.scss';
import { ColumnTitle } from '../ColumnTitle/ColumnTitle';
import { useAppSelector } from '../../../../Redux/reduxHooks';

type ColumnProps = {
  column: FullColumn;
  columnId: string;
};

export function Column(props: ColumnProps) {
  const boardId = useAppSelector((state) => state.board.currentBoardId);
  const board = useAppSelector((s) => s.board.board);
  if (!board || !boardId || !board) return null;

  const column = props.column;
  const tasks = column.tasks.slice().sort((a, b) => a.order - b.order);
  const orderForNewTask = column.tasks.length;

  // console.log('column tasks', tasks);
  return (
    <Droppable droppableId={column.id} type="task">
      {(provided) => (
        <div className={s.column} {...provided.droppableProps} ref={provided.innerRef}>
          <ColumnTitle
            taskLength={tasks.length}
            title={column.title}
            order={column.order}
            columnId={column.id}
            boardId={boardId}
          />

          {tasks.map((task, index) => (
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
          ))}

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
  );
}
