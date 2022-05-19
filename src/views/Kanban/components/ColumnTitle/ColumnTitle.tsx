import { DeleteColumnButton } from '../DeleteColumnButton/DeleteColumnButton';
import { SyntheticEvent, useState } from 'react';
import s from './ColumnTitle.module.scss';
import g from './../../../../App.module.scss';
import { updateColumn } from '../../../../services/columns';
import { useAppDispatch, useAppSelector } from '../../../../Redux/reduxHooks';
import { boardSlice } from '../../../../Redux/slices/boardSlice';
import { Column } from '../../../../services/interfaces/boards';

type Props = {
  taskLength: number;
  title: string;
  columnId: string;
  boardId: string;
  order: number;
};

export const ColumnTitle = (props: Props) => {
  const { taskLength, title, columnId, boardId, order } = props;

  const [dissabled, setDissabled] = useState(true);
  const [value, setValue] = useState(title);

  const dispatch = useAppDispatch();
  const { board } = useAppSelector((state) => state.board);
  const { setNewColumns } = boardSlice.actions;

  const handleTitle = () => {
    setDissabled(!dissabled);
  };

  const handleValue = (e: SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    setValue(target.value);
  };

  const onSubmit = async () => {
    await updateColumn(boardId, columnId, value, order);

    const oldColumns = board?.columns;
    const updatedOldColumns = [...(oldColumns as Column[])];
    const columns = board?.columns;
    const updatedColumn = columns?.filter((column) => column.id === columnId)[0] as Column;
    const newColumn = { ...updatedColumn };
    newColumn.title = value;
    const oldColumnIndex = columns?.findIndex((column) => column.id === newColumn.id) as number;
    updatedOldColumns.splice(oldColumnIndex, 1, newColumn);

    dispatch(setNewColumns(updatedOldColumns));
    setDissabled(!dissabled);
  };

  const onCnacel = () => {
    setDissabled(!dissabled);
  };

  return (
    <>
      <div className={s.title}>
        <div className={s.title__content}>
          <div className={s.count}>{taskLength}</div>
          {dissabled ? (
            <p className={`${g.font_title} ${s.column_title}`} onClick={handleTitle}>
              {title}
            </p>
          ) : (
            <input
              className={`${g.font_title} ${s.input__title} ${g.input}`}
              value={value}
              disabled={false}
              onChange={handleValue}
            />
          )}
        </div>
        {dissabled ? (
          <DeleteColumnButton columnId={columnId} />
        ) : (
          <div className={s.buttons_container}>
            <button className={`${g.button} ${g.drop_shadow} ${s.title_button}`} onClick={onSubmit}>
              ✓
            </button>

            <button className={`${g.button} ${g.drop_shadow} ${s.title_button}`} onClick={onCnacel}>
              X
            </button>
          </div>
        )}
      </div>
    </>
  );
};
