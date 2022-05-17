import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Modal } from '../../../components/Modal/Modal';
import { fetchBoards } from '../../../Redux/actionCreators/fetchBoards';
import { useAppDispatch, useAppSelector } from '../../../Redux/reduxHooks';
import { setNewBoard } from '../../../Redux/slices/boardsSlice';

import { createBoard } from '../../../services/boards';
import g from './../../../App.module.scss';

export type CreateBoardData = {
  title: string;
};

export const CreateNewBoard = () => {
  const newBoard = useAppSelector((state) => state.boards).newBoard;
  const dispatch = useAppDispatch();

  const [isOpenModal, setIsOpenModal] = useState(true);
  const handleCloseModal = () => {
    setIsOpenModal(false);
    dispatch(setNewBoard(!newBoard));
    dispatch(fetchBoards());
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateBoardData>();

  const handleCreateBoard = async (data: CreateBoardData) => {
    const response = await createBoard(data.title);
    console.log(response);
    if (response.hasOwnProperty('statusCode')) {
      alert('Ошибка создания доски');
      console.log(response);
    } else {
      reset({
        title: '',
      });
      handleCloseModal();
    }
  };

  const createContent = () => {
    return (
      <>
        <label>
          <p>title:</p>
          <input
            {...register('title', { required: true, minLength: 3, maxLength: 10 })}
            className={g.input}
            type="text"
            placeholder="name new board"
          />
          <br />
          {errors.title && (
            <span className={g.font_error}>
              {errors.title.type === 'required' && 'Title is required'}
              {errors.title.type === 'minLength' && 'Title must be at least 3 characters'}
              {errors.title.type === 'maxLength' && 'Title must be at most 10 characters'}
            </span>
          )}
        </label>
      </>
    );
  };

  return (
    <Modal
      open={isOpenModal}
      title="Enter a title of new board"
      content={createContent()}
      onConfirm={handleSubmit(handleCreateBoard)}
      onClose={handleCloseModal}
    />
  );
};
