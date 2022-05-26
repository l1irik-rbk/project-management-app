import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useTranslation } from 'react-i18next';

import g from './../../../../App.module.scss';
import s from './CreateTaskButton.module.scss';
import { Modal } from '../../../../components/Modal/Modal';
import { useAppDispatch } from '../../../../Redux/hooks';
import { createTaskThunk } from '../../../../Redux/slices/boardSlice';

export type CreateTaskData = {
  title: string;
  description: string;
};

type Props = {
  boardId: string | undefined;
  columnId: string | undefined;
};

export const CreateTaskButton = (props: Props) => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const handleOpenModal = () => setModalIsOpen(true);
  const handleCloseModal = () => setModalIsOpen(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateTaskData>();

  const handleCreateTask = async (data: CreateTaskData) => {
    const { boardId, columnId } = props;
    const { title, description } = data;
    if (!boardId || !columnId) return;

    dispatch(createTaskThunk(title, description, boardId, columnId));
    handleCloseModal();
    reset({
      title: '',
      description: '',
    });
  };

  const createContent = () => {
    return (
      <>
        <label className={s.label}>
          <p>{t('creationModal.title')}</p>
          <input
            {...register('title', { required: true, minLength: 3, maxLength: 16 })}
            className={g.input}
            type="text"
            placeholder={t('creationModal.creationTask.titlePlaceholder')}
          />

          {errors.title && (
            <span className={g.font_error}>
              {errors.title.type === 'required' && t('creationModal.errors.title.required')}
              {errors.title.type === 'minLength' && t('creationModal.errors.title.minLength')}
              {errors.title.type === 'maxLength' && t('creationModal.errors.title.maxLength16')}
            </span>
          )}
        </label>

        <label className={s.label}>
          <p>{t('creationModal.description')}</p>
          <textarea
            {...register('description', { required: true, minLength: 3, maxLength: 144 })}
            className={`${g.input} ${s.textarea}`}
            placeholder={t('creationModal.creationTask.descriptionPlaceholder')}
          ></textarea>

          {errors.description && (
            <span className={g.font_error}>
              {errors.description.type === 'required' &&
                t('creationModal.errors.description.required')}
              {errors.description.type === 'minLength' &&
                t('creationModal.errors.description.minLength')}
              {errors.description.type === 'maxLength' &&
                t('creationModal.errors.description.maxLength144')}
            </span>
          )}
        </label>
      </>
    );
  };

  return (
    <>
      <button
        className={`${g.button} ${g.drop_shadow} ${s.create__task}`}
        onClick={handleOpenModal}
      >
        +
      </button>
      <Modal
        title={t('creationModal.creationTask.title')}
        content={createContent()}
        onConfirm={handleSubmit(handleCreateTask)}
        onClose={handleCloseModal}
        open={modalIsOpen}
      />
    </>
  );
};
