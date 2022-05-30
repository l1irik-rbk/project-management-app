import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import s from './Task.module.scss';
import g from './../../../../App.module.scss';
import type { FullTask } from '../../../../services/interfaces/tasks';
import { DeleteTaskButton } from '../DeleteTaskButton/DeleteTaskButton';
import { Modal } from '../../../../components/Modal/Modal';
import { useAppDispatch } from '../../../../Redux/hooks';
import { getUserId } from '../../../../services/utils';
import { updateTask } from '../../../../services/tasks';
import { fetchBoard } from '../../../../Redux/slices/boardSlice';
import { showError, showSuccess } from '../../../../components/ToasterMessage/ToasterMessage';

type Props = {
  task: FullTask;
  boardId: string | undefined;
  columnId: string | undefined;
};

export type TaskData = {
  title: string;
  description: string;
};

export type BoardData = TaskData;

export const Task = (props: Props) => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const handleCloseModal = () => setModalIsOpen(false);
  const handleOpenModal = () => setModalIsOpen(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskData>();

  const handleEditTask = async (data: TaskData) => {
    const userId = await getUserId();
    const { boardId, columnId } = props;
    const { title, description } = data;

    if (boardId && columnId && userId) {
      const updateResponse = await updateTask(boardId, columnId, {
        ...props.task,
        title,
        description,
      });

      handleCloseModal();

      if (updateResponse.hasOwnProperty('error'))
        showError('toasterNotifications.board.errors.updateTask');
      else {
        reset({
          title: '',
          description: '',
        });
        dispatch(fetchBoard(boardId));
        showSuccess('toasterNotifications.board.success.updateTask');
      }
    }
  };

  const createContent = () => {
    return (
      <>
        <label className={g.label}>
          <p>{t('creationModal.title')}</p>
          <input
            {...register('title', { required: true, minLength: 3, maxLength: 16 })}
            className={g.input}
            type="text"
            defaultValue={props.task.title}
            placeholder={t('creationModal.changeTask.titlePlaceholder')}
          />

          {errors.title && (
            <span className={g.font_error}>
              {errors.title.type === 'required' && t('creationModal.errors.title.required')}
              {errors.title.type === 'minLength' && t('creationModal.errors.title.minLength')}
              {errors.title.type === 'maxLength' && t('creationModal.errors.title.maxLength16')}
            </span>
          )}
        </label>

        <label className={g.label}>
          <p>{t('creationModal.description')}</p>
          <textarea
            {...register('description', { required: true, minLength: 3, maxLength: 144 })}
            className={`${g.input} ${s.textarea}`}
            defaultValue={props.task.description}
            placeholder={t('creationModal.changeTask.descriptionPlaceholder')}
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
      <div onClick={handleOpenModal} className={s.task}>
        <div className={s.content}>
          <p className={s.title}>{props.task.title}</p>
          <p className={s.description}>{props.task.description}</p>
        </div>

        <DeleteTaskButton columnId={props.columnId} taskId={props.task.id} />
      </div>

      {modalIsOpen && (
        <Modal
          title={t('creationModal.changeTask.title')}
          content={createContent()}
          onConfirm={handleSubmit(handleEditTask)}
          onClose={handleCloseModal}
          open={modalIsOpen}
        />
      )}
    </>
  );
};
