import s from './DeleteColumnButton.module.scss';
import g from '../../../../App.module.scss';
import { useAppDispatch } from '../../../../Redux/hooks';
import { setSelectedColumnId } from '../../../../Redux/slices/boardSlice';
import { confirmationModalSlice } from '../../../../Redux/slices/confirmationModalSlice';
import { ActionType } from '../../../../components/ConfirmationModal/ConfirmationModal';

type Props = {
  columnId: string | undefined;
};

export const DeleteColumnButton = (props: Props) => {
  const dispatch = useAppDispatch();
  const { setPortalVisible, setConfirmationModalType } = confirmationModalSlice.actions;

  const handleDeleteColumn = async () => {
    if (props.columnId) dispatch(setSelectedColumnId(props.columnId));
    dispatch(setPortalVisible(true));
    dispatch(setConfirmationModalType(ActionType.DELETE_COLUMN));
  };

  return (
    <>
      <button onClick={handleDeleteColumn} className={`${g.button} ${g.drop_shadow} ${s.delete}`}>
        X
      </button>
    </>
  );
};
