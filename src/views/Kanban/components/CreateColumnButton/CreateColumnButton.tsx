import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { createColumn } from '../../../../services/columns';
import { Modal } from '../../../../components/Modal/Modal';
import g from './../../../../App.module.scss';

export type CreateColumnData = {
  title: string;
};

type Props = {
  boardId: string | undefined;
  orderForNewColumn: number;
  onCreateColumn: () => void;
};

export const CreateColumnButton = (props: Props) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const handleOpenModal = () => setIsOpenModal(true);
  const handleCloseModal = () => setIsOpenModal(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateColumnData>();

  const handleCreateColumn = async (data: CreateColumnData) => {
    const boardId = props.boardId;
    if (boardId) {
      const response = await createColumn(data.title, props.orderForNewColumn, boardId);

      if (response.hasOwnProperty('error')) {
        console.log(response);
      } else {
        reset({
          title: '',
        });
        props.onCreateColumn();
        handleCloseModal();
      }
    }
  };

  const createContent = () => {
    return (
      <>
        {console.log('>>>>>>', props.orderForNewColumn)}
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
      </>
    );
  };

  return (
    <>
      <button onClick={handleOpenModal}>Create new column</button>
      <Modal
        open={isOpenModal}
        title="Enter a new column"
        content={createContent()}
        onConfirm={handleSubmit(handleCreateColumn)}
        onClose={handleCloseModal}
      />
    </>
  );
};
