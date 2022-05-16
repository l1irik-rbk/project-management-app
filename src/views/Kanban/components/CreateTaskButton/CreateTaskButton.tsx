import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { createTask } from '../../../../services/tasks';
import { Modal } from '../../../../components/Modal/Modal';
import { getUserId } from '../../../../services/utils';
import g from './../../../../App.module.scss';
import s from './CreateTaskButton.module.scss';

export type CreateTaskData = {
  title: string;
  description: string;
};

type Props = {
  boardId: string | undefined;
  columnId: string | undefined;
  orderForNewTask: number;
  onCreateTask: () => void;
};

export const CreateTaskButton = (props: Props) => {
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
    const userId = await getUserId();
    const { boardId, columnId } = props;
    const { title, description } = data;
    const order = props.orderForNewTask;

    if (boardId && columnId && userId) {
      const createResponse = await createTask(title, order, description, boardId, columnId, userId);
      handleCloseModal();

      if (createResponse.hasOwnProperty('statusCode')) alert('Error');
      else {
        reset({
          title: '',
          description: '',
        });
        props.onCreateTask();
      }
    }
  };

  const createContent = () => {
    return (
      <>
        <label className={s.label}>
          <p>title:</p>
          <input
            {...register('title', { required: true, minLength: 3, maxLength: 20 })}
            className={g.input}
            type="text"
            placeholder="name task"
          />
          <br />

          {errors.title && (
            <span className={g.font_error}>
              {errors.title.type === 'required' && 'Login is required'}
              {errors.title.type === 'minLength' && 'Login must be at least 3 characters'}
              {errors.title.type === 'maxLength' && 'Login must be at most 20 characters'}
            </span>
          )}
        </label>

        <label className={s.label}>
          <p>description:</p>
          <input
            {...register('description', { required: true, minLength: 3, maxLength: 20 })}
            className={g.input}
            type="text"
            placeholder="description task"
          />
          <br />
          {errors.description && (
            <span className={g.font_error}>
              {errors.description.type === 'required' && 'Login is required'}
              {errors.description.type === 'minLength' && 'Login must be at least 3 characters'}
              {errors.description.type === 'maxLength' && 'Login must be at most 20 characters'}
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
        title="Enter a new column"
        content={createContent()}
        onConfirm={handleSubmit(handleCreateTask)}
        onClose={handleCloseModal}
        open={modalIsOpen}
      />
    </>
  );
};
