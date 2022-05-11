import React, { SyntheticEvent } from 'react';

import s from '../Main.module.scss';
import g from '../../../App.module.scss';
import { BoardProp } from './interfaces/BoardProp';
import { useAppDispatch, useAppSelector } from '../../../Redux/reduxHooks';
import { appSlice } from '../../../Redux/toolkitSlice';
import { Link } from 'react-router-dom';
import { ConfirmationModal } from '../../../components/ConfirmationModal/ConfirmationModal';
import { deleteBoard } from '../../../services/boards';
import { fetchBoards } from '../../../Redux/actionCreators/fetchBoards';

export const Board = ({ id, boardTitle }: BoardProp) => {
  const dispatch = useAppDispatch();
  const { setPortalVisible, setBoardId } = appSlice.actions;

  const { boards } = useAppSelector((state) => state.appReducer);
  const { selectedBoardId } = boards;

  const handleRemoveBoard = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(setPortalVisible(true));
    dispatch(setBoardId(id));
  };

  const handlePortalAction = async () => {
    await deleteBoard(selectedBoardId);
    dispatch(fetchBoards());
    dispatch(setBoardId(''));
  };

  return (
    <>
      <Link to={'/404'}>
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
