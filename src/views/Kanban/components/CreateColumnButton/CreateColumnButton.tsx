import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { createColumn } from '../../../../services/columns';
import { Modal } from '../../../../components/Modal/Modal';
import g from './../../../../App.module.scss';
import s from './CreateColumnButton.module.scss';
import { fetchBoard } from '../../../../Redux/actionCreators/fetchBoard';
import { useAppDispatch } from '../../../../Redux/reduxHooks';

export type CreateColumnData = {
  title: string;
};

type Props = {
  boardId: string | undefined;
  orderForNewColumn: number;
};

export const CreateColumnButton = (props: Props) => {
  const dispatch = useAppDispatch();
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
      } else {
        // alert('Column created');
        reset({
          title: '',
        });
        handleCloseModal();
        dispatch(fetchBoard(boardId));
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
              {errors.title.type === 'required' && 'Title is required'}
              {errors.title.type === 'minLength' && 'Title must be at least 3 characters'}
              {errors.title.type === 'maxLength' && 'Title must be at most 20 characters'}
            </span>
          )}
        </label>
      </>
    );
  };

  return (
    <>
      <div onClick={handleOpenModal}>
        <button className={s.create__column}>Add Column</button>
      </div>

      <Modal
        open={isOpenModal}
        title="Enter a title of new column"
        content={createContent()}
        onConfirm={handleSubmit(handleCreateColumn)}
        onClose={handleCloseModal}
      />
    </>
  );
};
