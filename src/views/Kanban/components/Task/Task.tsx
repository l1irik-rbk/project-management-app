import { FullTask } from '../../../../services/interfaces/tasks';
import s from './Task.module.scss';
import g from './../../../../App.module.scss';
import { DeleteTaskButton } from '../DeleteTaskButton/DeleteTaskButton';

type Props = {
  task: FullTask;
  boardId: string | undefined;
  columnId: string | undefined;
};

export const Task = (props: Props) => {
  return (
    <>
      <div className={s.task}>
        <p className={s.title}>{props.task.title}</p>
        {/* <p>{props.task.description}</p> */}
        <DeleteTaskButton
          boardId={props.boardId}
          columnId={props.columnId}
          taskId={props.task.id}
        />
      </div>
    </>
  );
};
