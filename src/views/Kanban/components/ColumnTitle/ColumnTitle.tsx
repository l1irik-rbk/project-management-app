import { DeleteColumnButton } from '../DeleteColumnButton/DeleteColumnButton';
import s from './ColumnTitle.module.scss';
import g from './../../../../App.module.scss';

type Props = {
  taskLength: number;
  title: string;
  columnId: string;
  boardId: string;
};

export const ColumnTitle = (props: Props) => {
  return (
    <>
      <div className={s.title}>
        <div className={s.title__content}>
          <div className={s.count}>{props.taskLength}</div>
          <p className={g.font_title}>{props.title}</p>
        </div>

        <DeleteColumnButton columnId={props.columnId} />
      </div>
    </>
  );
};
