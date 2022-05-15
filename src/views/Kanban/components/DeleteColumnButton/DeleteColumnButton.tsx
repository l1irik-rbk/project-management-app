import { SyntheticEvent } from 'react';

import g from '../../../../App.module.scss';
import s from './DeleteColumnButton.module.scss';
import { appSlice } from '../../../../Redux/toolkitSlice';
import { useAppDispatch } from '../../../../Redux/reduxHooks';
import { ActionType } from '../../../../Redux/interfaces/initialState';

type Props = {
  boardId: string | undefined;
  columnId: string | undefined;
};

export const DeleteColumnButton = (props: Props) => {
  const { columnId } = props;
  const dispatch = useAppDispatch();
  const { setPortalVisible, setSelectedColumnId, setConfirmationModalType } = appSlice.actions;

  const handleRemoveColumn = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(setPortalVisible(true));
    dispatch(setConfirmationModalType(ActionType.DELETE_COLUMN));
    if (columnId) dispatch(setSelectedColumnId(columnId));
  };

  return (
    <button onClick={handleRemoveColumn} className={`${g.button} ${g.drop_shadow} ${s.delete}`}>
      X
    </button>
  );
};
