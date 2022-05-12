import { FullColumn } from '../../../../services/interfaces/columns';
import { CreateTaskButton } from '../CreateTaskButton/CreateTaskButton';
import { Task } from '../Task/Task';
import s from './Column.module.scss';
import { ColumnTitle } from '../ColumnTitle/ColumnTitle';

type Props = {
  column: FullColumn;
  boardId: string;
};

export const Column = (props: Props) => {
  return (
    <>
      <div className={s.column}>
        <ColumnTitle
          taskLength={props.column.tasks.length}
          title={props.column.title}
          columnId={props.column.id}
          boardId={props.boardId}
        />

        {props.column.tasks
          .sort((a, b) => a.order - b.order)
          .map((task) => (
            <Task key={task.id} boardId={props.boardId} columnId={props.column.id} task={task} />
          ))}

        <CreateTaskButton boardId={props.boardId} columnId={props.column.id} />
      </div>
    </>
  );
};
