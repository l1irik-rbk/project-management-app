import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

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

    if (response.hasOwnProperty('statusCode')) alert('Error');
    else {
      reset({
        title: '',
      });
      handleCloseModal();
    }
  };

  const createContent = () => {
    return (
      <>
        <label className={g.label}>
          <p>{t('creationModal.title')}</p>
          <input
            {...register('title', { required: true, minLength: 3, maxLength: 10 })}
            className={g.input}
            type="text"
            placeholder={t('creationModal.creationBoard.placeholder')}
          />

          {errors.title && (
            <span className={g.font_error}>
              {errors.title.type === 'required' && t('creationModal.errors.title.required')}
              {errors.title.type === 'minLength' && t('creationModal.errors.title.minLength')}
              {errors.title.type === 'maxLength' && t('creationModal.errors.title.maxLength10')}
            </span>
          )}
        </label>
      </>
    );
  };

  return (
    <Modal
      open={isOpenModal}
      title={t('creationModal.creationBoard.title')}
      content={createContent()}
      onConfirm={handleSubmit(handleCreateBoard)}
      onClose={handleCloseModal}
    />
  );
};
