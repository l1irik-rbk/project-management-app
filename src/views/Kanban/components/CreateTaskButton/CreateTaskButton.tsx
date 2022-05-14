import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { createTask } from '../../../../services/tasks';
import { Modal } from '../../../../components/Modal/Modal';
import g from './../../../../App.module.scss';
import { getUserId } from '../../../../services/utils';

export type CreateTaskData = {
  title: string;
  order: number;
  description: string;
};

type Props = {
  boardId: string | undefined;
  columnId: string | undefined;
};

export const CreateTaskButton = (props: Props) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const handleOpenModal = () => setModalIsOpen(true);
  const handleCloseModal = () => setModalIsOpen(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTaskData>();

  const handleCreateTask = async (data: CreateTaskData) => {
    const userId = await getUserId();
    const { boardId, columnId } = props;

    if (boardId && columnId && userId) {
      const createResponse = await createTask(data, boardId, columnId, userId);

      if (createResponse.hasOwnProperty('statusCode')) alert('Error');
      else alert('Task created');
    }
  };

  const createContent = () => {
    return (
      <>
        <label>
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

        <label>
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

        <label>
          <p>order:</p>
          <input
            {...register('order', { required: true, min: 0, max: 100 })}
            className={g.input}
            type="number"
            placeholder="order task"
          />
          <br />
          {errors.order && (
            <span className={g.font_error}>
              {errors.order.type === 'required' && 'Order is required'}
              {errors.order.type === 'min' && 'Order must be at least 1'}
              {errors.order.type === 'max' && 'Order must be at most 100'}
            </span>
          )}
        </label>
      </>
    );
  };

  return (
    <>
      <button onClick={handleOpenModal}>+</button>
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
