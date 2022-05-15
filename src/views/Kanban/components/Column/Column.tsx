import { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';

import { FullColumn, Task as TaskType } from '../../../../services/interfaces/columns';
import { CreateTaskButton } from '../CreateTaskButton/CreateTaskButton';
import { Task } from '../Task/Task';
import s from './Column.module.scss';
import { ColumnTitle } from '../ColumnTitle/ColumnTitle';
import { updateTask } from '../../../../services/tasks';
import { getColumn } from '../../../../services/columns';
import { useAppSelector } from '../../../../Redux/reduxHooks';

type ColumnProps = {
  column: FullColumn;
  boardId: string;
};

export function Column(props: ColumnProps) {
  const { currentBoard } = useAppSelector((state) => state.appReducer);
  const { board } = currentBoard;
  const updatedColumn = board?.columns.filter((column) => column.id === props.column.id)[0];

  const [column, setColumn] = useState<FullColumn>(props.column);
  const [tasks, setTasks] = useState<TaskType[]>(column.tasks);
  const orderForNewTask = column.tasks.length;

  useEffect(() => {
    const update = async () => {
      await syncTasksOrderToServer(tasks);
    };
    update();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks]);

  useEffect(() => {
    setTasks(column.tasks);
  }, [column]);

  useEffect(() => {
    if (updatedColumn) setColumn(updatedColumn);
  }, [updatedColumn]);

  const getColumnData = async () => {
    const data = await getColumn(props.boardId, column.id);
    setColumn(data);
  };

  const onDragEnd = (result: DropResult) => {
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

    setTasks(newOrdersTasks);
  };

  const syncTasksOrderToServer = (tasks: TaskType[]) => {
    const syncOneTaskOrderToServer = async (task: TaskType) =>
      updateTask(props.boardId, column.id, task);
    const allTasks = tasks.map((task) => syncOneTaskOrderToServer(task));
    const updatedTasks = Promise.all(allTasks);

    return updatedTasks;
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="todo">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            <div className={s.column}>
              <ColumnTitle
                taskLength={tasks.length}
                title={column.title}
                columnId={column.id}
                boardId={props.boardId}
              />

              {tasks
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((task, index) => {
                  return (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Task
                            key={task.id}
                            boardId={props.boardId}
                            columnId={column.id}
                            task={task}
                          />
                        </div>
                      )}
                    </Draggable>
                  );
                })}

              {provided.placeholder}

              <CreateTaskButton
                boardId={props.boardId}
                columnId={column.id}
                orderForNewTask={orderForNewTask}
                onCreateTask={getColumnData}
              />
            </div>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
