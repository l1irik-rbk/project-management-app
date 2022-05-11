import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppSelector } from '../../../../Redux/reduxHooks';
import { createColumn } from '../../../../services/columns';

import { Modal } from '../Modal/Modal';
import g from './../../../../App.module.scss';

export type CreateColumnData = {
  title: string;
  order: number;
};

export const CreateColumnButton = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const handleOpenModal = () => setModalIsOpen(true);
  const handleCloseModal = () => setModalIsOpen(false);
  const boardId = useAppSelector((state) => state.appReducer.board.id);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateColumnData>();

  const handleCreateColumn = async (data: CreateColumnData) => {
    console.log(data);
    if (boardId) {
      const response = await createColumn(data, boardId);

      if (response.hasOwnProperty('error')) {
        console.log(response);
      } else {
        console.log(response);
        alert('Column created');
      }
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
            placeholder="name column"
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
          <p>order:</p>
          <input
            {...register('order', { required: true, min: 0, max: 100 })}
            className={g.input}
            type="number"
            placeholder="order column"
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
      <button onClick={handleOpenModal}>Create new column</button>
      <Modal
        title="Enter a new column"
        content={createContent()}
        action={handleSubmit(handleCreateColumn)}
        closeAction={handleCloseModal}
        open={modalIsOpen}
      />
    </>
  );
};
