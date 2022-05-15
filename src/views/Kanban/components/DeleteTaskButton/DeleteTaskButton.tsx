import { SyntheticEvent } from 'react';

import g from '../../../../App.module.scss';
import { ActionType } from '../../../../Redux/interfaces/initialState';
import { useAppDispatch } from '../../../../Redux/reduxHooks';
import { appSlice } from '../../../../Redux/toolkitSlice';
import s from './DeleteTaskButton.module.scss';

type Props = {
  boardId: string | undefined;
  columnId: string | undefined;
  taskId: string | undefined;
};

export const DeleteTaskButton = (props: Props) => {
  const { boardId, columnId, taskId } = props;
  const dispatch = useAppDispatch();
  const { setPortalVisible, setSelectedColumnId, setConfirmationModalType, setSelectedTaskId } =
    appSlice.actions;

  const handleRemoveColumn = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(setPortalVisible(true));
    dispatch(setConfirmationModalType(ActionType.DELETE_TASK));
    if (boardId && columnId && taskId) {
      dispatch(setSelectedColumnId(columnId));
      dispatch(setSelectedTaskId(taskId));
    }
  };

  return (
    <button onClick={handleRemoveColumn} className={`${g.button} ${g.drop_shadow} ${s.delete}`}>
      X
    </button>
  );
};
