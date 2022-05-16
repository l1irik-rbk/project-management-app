import { useState } from 'react';

import g from '../../../../App.module.scss';
import s from './DeleteTaskButton.module.scss';
import { Modal } from '../../../../components/Modal/Modal';
import { deleteTask } from '../../../../services/tasks';

type Props = {
  boardId: string | undefined;
  columnId: string | undefined;
  taskId: string | undefined;
};

export const DeleteTaskButton = (props: Props) => {
  const { boardId, columnId, taskId } = props;
  const [isOpenModal, setIsOpenModal] = useState(false);
  const handleOpenModal = () => setIsOpenModal(true);
  const handleCloseModal = () => setIsOpenModal(false);

  const handleDeleteTask = async () => {
    if (boardId && columnId && taskId) {
      const result = await deleteTask(boardId, columnId, taskId);
      if (result.hasOwnProperty('success')) alert('Task deleted');
      else alert('Error');
      handleCloseModal();
    }
  };

  const handleOnConfirm = () => {
    handleDeleteTask();
  };

  return (
    <>
      <button onClick={handleOpenModal} className={`${g.button} ${g.drop_shadow} ${s.delete}`}>
        X
      </button>

      <Modal
        open={isOpenModal}
        title={'Are you sure?'}
        content={'You want to delete this task? This action cannot be undone.'}
        onConfirm={handleOnConfirm}
        onClose={handleCloseModal}
      />
    </>
  );
};
