import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { createColumn } from '../../../../services/columns';
import { Modal } from '../../../../components/Modal/Modal';
import g from './../../../../App.module.scss';
import s from './CreateColumnButton.module.scss';
import { useAppDispatch, useAppSelector } from '../../../../Redux/reduxHooks';
import { useTranslation } from 'react-i18next';
import { boardSlice } from '../../../../Redux/slices/boardSlice';
import { Column } from '../../../../services/interfaces/boards';
import { getColumns } from '../../../../helpers/getColumns';

export type ColumnData = {
  title: string;
};

type Props = {
  boardId: string | undefined;
  orderForNewColumn: number;
};

export const CreateColumnButton = (props: Props) => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const { setNewColumns } = boardSlice.actions;
  const board = useAppSelector((state) => state.board.board);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const handleOpenModal = () => setIsOpenModal(true);
  const handleCloseModal = () => setIsOpenModal(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ColumnData>();

  const handleCreateColumn = async (data: ColumnData) => {
    const boardId = props.boardId;
    if (boardId) {
      const response = await createColumn(data.title, props.orderForNewColumn, boardId);

      if (response.hasOwnProperty('error')) alert('Error');
      else {
        reset({
          title: '',
        });
        handleCloseModal();

        const newColumn = response as Column;
        newColumn.tasks = [];
        const columns = getColumns(board);
        columns?.push(newColumn);

        if (columns) dispatch(setNewColumns(columns));
      }
    }
  };

  const createContent = () => {
    return (
      <>
        <label>
          <p>{t('creationModal.title')}</p>
          <input
            {...register('title', { required: true, minLength: 3, maxLength: 16 })}
            className={g.input}
            type="text"
            placeholder={t('creationModal.creationColumn.placeholder')}
          />

          {errors.title && (
            <span className={g.font_error}>
              {errors.title.type === 'required' && t('creationModal.errors.title.required')}
              {errors.title.type === 'minLength' && t('creationModal.errors.title.minLength')}
              {errors.title.type === 'maxLength' && t('creationModal.errors.title.maxLength16')}
            </span>
          )}
        </label>
      </>
    );
  };

  return (
    <>
      <div onClick={handleOpenModal}>
        <button className={s.create__column}>{t('kanban.addColumn')}</button>
      </div>

      <Modal
        open={isOpenModal}
        title={t('creationModal.creationColumn.title')}
        content={createContent()}
        onConfirm={handleSubmit(handleCreateColumn)}
        onClose={handleCloseModal}
      />
    </>
  );
};
