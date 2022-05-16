import React, { SyntheticEvent } from 'react';
import { Link } from 'react-router-dom';

import s from '../Main.module.scss';
import g from '../../../App.module.scss';
import { BoardProp } from './interfaces/BoardProp';
import { useAppDispatch } from '../../../Redux/reduxHooks';
import { boardsSlice } from '../../../Redux/slices/boardsSlice';
import { confirmationModalSlice } from '../../../Redux/slices/confirmationModalSlice';
import { ActionType } from '../../../Redux/interfaces/confirmationModa';

export const Board = ({ id, boardTitle }: BoardProp) => {
  const dispatch = useAppDispatch();
  const { setPortalVisible, setConfirmationModalType } = confirmationModalSlice.actions;
  const { setSelectedBoardId } = boardsSlice.actions;

  const handleRemoveBoard = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(setPortalVisible(true));
    dispatch(setConfirmationModalType(ActionType.DELETE_BOARD));
    dispatch(setSelectedBoardId(id));
  };

  return (
    <Link to={`/kanban/${id}`}>
      <div className={`${s.board} ${g.drop_shadow} ${g.button}`}>
        <h5 className={`${g.font_title}`}>{boardTitle}</h5>
        <button className={`${g.button} ${g.drop_shadow}`} onClick={handleRemoveBoard}>
          X
        </button>
      </div>
    </Link>
  );
};
