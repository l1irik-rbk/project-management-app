import { useState } from 'react';
import { useForm } from 'react-hook-form';

import s from './ColumnTitle.module.scss';
import g from './../../../../App.module.scss';
import { updateColumn } from '../../../../services/columns';
import { useAppDispatch, useAppSelector } from '../../../../Redux/reduxHooks';
import { boardSlice } from '../../../../Redux/slices/boardSlice';
import type { Column } from '../../../../services/interfaces/boards';
import { DeleteColumnButton } from '../DeleteColumnButton/DeleteColumnButton';
import { ColumnData } from '../CreateColumnButton/CreateColumnButton';
import { useTranslation } from 'react-i18next';

type Props = {
  taskLength: number;
  title: string;
  columnId: string;
  boardId: string;
  order: number;
};

export const ColumnTitle = (props: Props) => {
  const { t } = useTranslation();

  const { taskLength, title, columnId, boardId, order } = props;

  const [dissabled, setDissabled] = useState(true);

  const dispatch = useAppDispatch();
  const { board } = useAppSelector((state) => state.board);
  const { setNewColumns } = boardSlice.actions;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ColumnData>();

  const showEdit = () => {
    setDissabled(!dissabled);
  };

  const hideEdit = () => {
    setDissabled(!dissabled);
  };

  const onSubmit = async (data: ColumnData) => {
    const { title } = data;
    await updateColumn(boardId, columnId, title, order);

    const oldColumns = board?.columns;
    const updatedOldColumns = [...(oldColumns as Column[])];
    const columns = board?.columns;
    const updatedColumn = columns?.filter((column) => column.id === columnId)[0] as Column;
    const newColumn = { ...updatedColumn };
    newColumn.title = title;
    const oldColumnIndex = columns?.findIndex((column) => column.id === newColumn.id) as number;
    updatedOldColumns.splice(oldColumnIndex, 1, newColumn);

    dispatch(setNewColumns(updatedOldColumns));
    setDissabled(!dissabled);
  };

  return (
    <>
      <div className={s.title}>
        <div className={s.title__content}>
          <div className={s.count}>{taskLength}</div>
          {dissabled ? (
            <p className={`${g.font_title} ${s.column_title}`} onClick={showEdit}>
              {title}
            </p>
          ) : (
            <input
              {...register('title', { required: true, minLength: 3, maxLength: 16 })}
              className={`${g.font_title} ${s.input__title} ${g.input}`}
              defaultValue={title}
            />
          )}
        </div>

        {dissabled ? (
          <DeleteColumnButton columnId={columnId} />
        ) : (
          <div className={s.buttons_container}>
            <button
              className={`${g.button} ${g.drop_shadow} ${s.title_button}`}
              onClick={handleSubmit(onSubmit)}
            >
              ✓
            </button>

            <button className={`${g.button} ${g.drop_shadow} ${s.title_button}`} onClick={hideEdit}>
              X
            </button>
          </div>
        )}
      </div>

      {errors.title && (
        <span className={g.font_error}>
          {errors.title.type === 'required' && t('creationModal.errors.title.required')}
          {errors.title.type === 'minLength' && t('creationModal.errors.title.minLength')}
          {errors.title.type === 'maxLength' && t('creationModal.errors.title.maxLength16')}
        </span>
      )}
    </>
  );
};
