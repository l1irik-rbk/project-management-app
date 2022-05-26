import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import g from './../../../App.module.scss';
import { Modal } from '../../../components/Modal/Modal';
import { useAppDispatch } from '../../../Redux/hooks';
import { createBoardThunk } from '../../../Redux/slices/boardsSlice';

export type CreateBoardData = {
  title: string;
  description: string;
};

export const CreateNewBoard = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [isOpenModal, setIsOpenModal] = useState(true);
  const handleCloseModal = () => setIsOpenModal(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateBoardData>();

  const handleCreateBoard = async (data: CreateBoardData) => {
    dispatch(createBoardThunk({ title: data.title, description: data.description }));
    handleCloseModal();
    reset({
      title: '',
      description: '',
    });
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

        <label className={g.label}>
          <p>{t('creationModal.description')}</p>
          <input
            {...register('description', { required: true, minLength: 0, maxLength: 20 })}
            className={g.input}
            type="text"
            placeholder={t('creationModal.creationBoard.descripton_placeholder')}
          />

          {errors.description && (
            <span className={g.font_error}>
              {errors.description.type === 'required' &&
                t('creationModal.errors.description.required')}
              {errors.description.type === 'maxLength' &&
                t('creationModal.errors.description.maxLength20')}
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
