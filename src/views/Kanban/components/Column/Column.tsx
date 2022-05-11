import { FullColumn } from '../../../../services/interfaces/columns';
import { CreateTaskButton } from '../CreateTaskButton/CreateTaskButton';
import { Task } from '../Task/Task';
import s from './Column.module.scss';

type Props = {
  column: FullColumn;
};

export const Column = (props: Props) => {
  return (
    <>
      <div className={s.column}>
        <h3>{props.column.title}</h3>
        {props.column.tasks
          .sort((a, b) => a.order - b.order)
          .map((task) => (
            <Task key={task.id} task={task} />
          ))}
        <CreateTaskButton columnId={props.column.id} />
      </div>
    </>
  );
};
