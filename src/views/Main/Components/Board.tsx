import React from 'react';
import s from '../Main.module.scss';
import g from '../../../App.module.scss';
import { BoardProp } from './interfaces/BoardProp';
import { useAppDispatch } from '../../../Redux/reduxHooks';
import { appSlice } from '../../../Redux/toolkitSlice';
import { Link } from 'react-router-dom';

export const Board = ({ id, boardTitle }: BoardProp) => {
  const dispatch = useAppDispatch();
  const { setPortalVisible, setBoardId } = appSlice.actions;

  const showPortal = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(setPortalVisible(true));
    dispatch(setBoardId(id));
  };

  return (
    <Link to={'/404'}>
      <div className={`${s.board}`}>
        <h5 className={`${g.font_title}`}>{boardTitle}</h5>
        <button className={`${g.button} ${g.drop_shadow}`} onClick={showPortal}>
          X
        </button>
      </div>
    </Link>
  );
};
