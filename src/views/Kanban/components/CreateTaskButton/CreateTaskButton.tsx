import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppSelector } from '../../../../Redux/reduxHooks';
import { createColumn } from '../../../../services/columns';
import { createTask } from '../../../../services/tasks';
import { findUser } from '../../../../services/users';
import { getLogin } from '../../../../services/utils';

import { Modal } from '../Modal/Modal';
import g from './../../../../App.module.scss';

export type CreateTaskData = {
  title: string;
  order: number;
  description: string;
};

type Props = {
  columnId: string;
};

export const CreateTaskButton = (props: Props) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const handleOpenModal = () => setModalIsOpen(true);
  const handleCloseModal = () => setModalIsOpen(false);
  const boardId = useAppSelector((state) => state.appReducer.board.id);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTaskData>();

  const handleCreateTask = async (data: CreateTaskData) => {
    console.log(data);

    const login = getLogin();
    if (login) {
      const user = await findUser(login);
      const userId = user?.id;

      if (boardId && userId)
        console.log('>>>', await createTask(data, boardId, props.columnId, userId));
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
        action={handleSubmit(handleCreateTask)}
        closeAction={handleCloseModal}
        open={modalIsOpen}
      />
    </>
  );
};
