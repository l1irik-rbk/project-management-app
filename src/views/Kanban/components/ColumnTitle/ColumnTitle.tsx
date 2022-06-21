import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import s from './ColumnTitle.module.scss';
import g from './../../../../App.module.scss';
import { useAppDispatch, useAppSelector } from '../../../../Redux/hooks';
import { editColumnTitleThunk } from '../../../../Redux/slices/boardSlice';
import { DeleteColumnButton } from '../DeleteColumnButton/DeleteColumnButton';
import { ColumnData } from '../CreateColumnButton/CreateColumnButton';

type Props = {
  taskLength: number;
  title: string;
  columnId: string;
  boardId: string;
  order: number;
};

export const ColumnTitle = (props: Props) => {
  const { t } = useTranslation();
  const [dissabled, setDissabled] = useState(true);
  const dispatch = useAppDispatch();
  const { board } = useAppSelector((state) => state.board);

  const { taskLength, title, columnId, boardId, order } = props;

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
    if (!board) return;
    const { title } = data;
    setDissabled(!dissabled);

    dispatch(editColumnTitleThunk(boardId, columnId, title, order, board));
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
