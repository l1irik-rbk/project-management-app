import React, { SyntheticEvent } from 'react';
import { Link } from 'react-router-dom';

import s from '../Main.module.scss';
import g from '../../../App.module.scss';
import { BoardProp } from './interfaces/BoardProp';
import { useAppDispatch, useAppSelector } from '../../../Redux/reduxHooks';
import { appSlice } from '../../../Redux/toolkitSlice';
import { ConfirmationModal } from '../../../components/ConfirmationModal/ConfirmationModal';
import { deleteBoard } from '../../../services/boards';
import { fetchBoards } from '../../../Redux/actionCreators/fetchBoards';

export const Board = ({ id, boardTitle }: BoardProp) => {
  const dispatch = useAppDispatch();
  const { setPortalVisible, setSelectedBoardId } = appSlice.actions;

  const { boards } = useAppSelector((state) => state.appReducer);
  const { selectedBoardId } = boards;

  const handleRemoveBoard = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(setPortalVisible(true));
    dispatch(setSelectedBoardId(id));
  };

  const handlePortalAction = async () => {
    await deleteBoard(selectedBoardId);
    dispatch(fetchBoards());
    dispatch(setSelectedBoardId(''));
  };

  return (
    <>
      <Link to={`/kanban/${id}`}>
        <div className={`${s.board} ${g.drop_shadow} ${g.button}`}>
          <h5 className={`${g.font_title}`}>{boardTitle}</h5>
          <button className={`${g.button} ${g.drop_shadow}`} onClick={handleRemoveBoard}>
            X
          </button>
        </div>
      </Link>

      <ConfirmationModal
        text={'You will remove the board and all of its contents.'}
        action={handlePortalAction}
      />
    </>
  );
};
