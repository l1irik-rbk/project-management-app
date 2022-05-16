import { useState } from 'react';

import g from '../../../../App.module.scss';
import s from './DeleteColumnButton.module.scss';
import { deleteColumn } from '../../../../services/columns';
import { Modal } from '../../../../components/Modal/Modal';

type Props = {
  boardId: string | undefined;
  columnId: string | undefined;
};

export const DeleteColumnButton = (props: Props) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const handleOpenModal = () => setIsOpenModal(true);
  const handleCloseModal = () => setIsOpenModal(false);

  const handleDeleteColumn = async () => {
    const { boardId, columnId } = props;
    if (boardId && columnId) {
      const result = await deleteColumn(boardId, columnId);

      if (result.hasOwnProperty('success')) alert('Column deleted');
      else alert('Error');
      handleCloseModal();
    }
  };

  const handleOnConfirm = () => {
    handleDeleteColumn();
  };

  return (
    <>
      <button onClick={handleOpenModal} className={`${g.button} ${g.drop_shadow} ${s.delete}`}>
        X
      </button>

      <Modal
        open={isOpenModal}
        title={'Are you sure?'}
        content={
          'You want to delete this column? All tasks will be deleted. This action cannot be undone.'
        }
        onConfirm={handleOnConfirm}
        onClose={handleCloseModal}
      />
    </>
  );
};
