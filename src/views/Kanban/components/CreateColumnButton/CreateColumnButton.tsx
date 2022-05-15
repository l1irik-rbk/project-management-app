import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { createColumn, getColumn } from '../../../../services/columns';
import { Modal } from '../../../../components/Modal/Modal';
import g from './../../../../App.module.scss';
import s from './CreateColumnButton.module.scss';
import { useAppDispatch, useAppSelector } from '../../../../Redux/reduxHooks';
import { Column } from '../../../../services/interfaces/columns';
import { appSlice } from '../../../../Redux/toolkitSlice';
import { getColumns } from '../../../../helpers/getColumns';

export type CreateColumnData = {
  title: string;
};

type Props = {
  boardId: string | undefined;
  orderForNewColumn: number;
};

export const CreateColumnButton = (props: Props) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const handleOpenModal = () => setIsOpenModal(true);
  const handleCloseModal = () => setIsOpenModal(false);

  const dispatch = useAppDispatch();
  const { setNewColumn } = appSlice.actions;
  const { currentBoard } = useAppSelector((state) => state.appReducer);
  const { board } = currentBoard;

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
      console.log(response);
      if (response.hasOwnProperty('error')) {
        // Error
        console.log(response);
      } else {
        reset({
          title: '',
        });
        handleCloseModal();
        const { id } = response as Column;
        const newColumn = await getColumn(boardId, id);
        const columns = board ? getColumns(board) : null;
        columns?.push(newColumn);

        if (columns) dispatch(setNewColumn(columns));
      }
    }
  };

  const createContent = () => {
    return (
      <>
        {/* {console.log('>>>>>>', props.orderForNewColumn)} */}
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
        <button className={`${s.create__column}`}>Add Column</button>
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
