import { FullTask } from '../../../../services/interfaces/tasks';
import s from './Task.module.scss';

type Props = {
  task: FullTask;
};

export const Task = (props: Props) => {
  return (
    <>
      <div className={s.task}>
        <p className={s.title}>{props.task.title}</p>
        {/* <p>{props.task.description}</p> */}
        <button>X</button>
      </div>
    </>
  );
};
