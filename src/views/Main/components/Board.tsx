import { SyntheticEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import s from '../Main.module.scss';
import g from '../../../App.module.scss';
import { useAppDispatch } from '../../../Redux/hooks';
import { boardsSlice, changeBoardThunk } from '../../../Redux/slices/boardsSlice';
import { confirmationModalSlice } from '../../../Redux/slices/confirmationModalSlice';
import { ActionType } from '../../../components/ConfirmationModal/ConfirmationModal';
import type { Board as BoardType } from '../../../services/interfaces/boards';
import { BoardData } from '../../Kanban/components/Task/Task';
import { Modal } from '../../../components/Modal/Modal';

export const Board = ({ id, title, description }: BoardType) => {
  const dispatch = useAppDispatch();
  const { setPortalVisible, setConfirmationModalType } = confirmationModalSlice.actions;
  const { setSelectedBoardId } = boardsSlice.actions;

  const { t } = useTranslation();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const handleCloseModal = () => setModalIsOpen(false);
  const handleOpenModal = () => setModalIsOpen(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BoardData>();

  const handleRemoveBoard = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(setPortalVisible(true));
    dispatch(setConfirmationModalType(ActionType.DELETE_BOARD));
    dispatch(setSelectedBoardId(id));
  };

  const openModal = (e: SyntheticEvent) => {
    e.preventDefault();
    handleOpenModal();
  };

  const changeDescription = async (data: BoardData) => {
    const { title, description } = data;
    dispatch(changeBoardThunk(id, title, description));

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
            defaultValue={title}
            placeholder={t('creationModal.changeBoard.titlePlaceholder')}
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
          <textarea
            {...register('description', { required: true, minLength: 3, maxLength: 20 })}
            className={`${g.input} ${s.textarea}`}
            defaultValue={description}
            placeholder={t('creationModal.changeBoard.descriptionPlaceholder')}
          ></textarea>

          {errors.description && (
            <span className={g.font_error}>
              {errors.description.type === 'required' &&
                t('creationModal.errors.description.required')}
              {errors.description.type === 'minLength' &&
                t('creationModal.errors.description.minLength')}
              {errors.description.type === 'maxLength' &&
                t('creationModal.errors.description.maxLength20')}
            </span>
          )}
        </label>
      </>
    );
  };

  return (
    <>
      <Link to={`/kanban/${id}`}>
        <div className={`${s.board} ${g.drop_shadow} ${g.button}`}>
          <div>
            <h5 className={`${g.font_title}`}>{title}</h5>
            <p className={s.description}>{description}</p>
          </div>
          <div className={s.buttons}>
            <button className={`${g.button} ${g.drop_shadow} ${s.edit_button}`} onClick={openModal}>
              &#9998;
            </button>
            <button className={`${g.button} ${g.drop_shadow}`} onClick={handleRemoveBoard}>
              X
            </button>
          </div>
        </div>
      </Link>

      {modalIsOpen && (
        <Modal
          title={t('creationModal.changeBoard.title')}
          content={createContent()}
          onConfirm={handleSubmit(changeDescription)}
          onClose={handleCloseModal}
          open={modalIsOpen}
        />
      )}
    </>
  );
};
