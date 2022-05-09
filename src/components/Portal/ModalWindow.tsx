import React from 'react';

import s from './ModalWindow.module.scss';
import g from './../../App.module.scss';
import { useAppDispatch, useAppSelector } from '../../Redux/reduxHooks';
import { appSlice } from '../../Redux/toolkitSlice';
import { deleteBoard } from '../../services/boards';
import { fetchBoards } from '../../views/Main/Main';

const ModalWindow = () => {
  const { isPortalVisible, token, boards } = useAppSelector((state) => state.appReducer);
  const { selectedBoardId } = boards;
  const dispatch = useAppDispatch();
  const { setPortalVisible, setBoardId } = appSlice.actions;

  const portalVisibility = isPortalVisible ? `${s.overlay}` : `${s.overlay__hidden}`;

  const closePortal = () => {
    dispatch(setPortalVisible(false));
    dispatch(setBoardId(''));
  };

  const deleteOldBoard = async () => {
    if (token) {
      await deleteBoard(selectedBoardId, token);
      dispatch(setPortalVisible(false));
      dispatch(fetchBoards(token));
      dispatch(setBoardId(''));
    }
  };

  return (
    <div className={portalVisibility} onClick={closePortal}>
      <div className={`${s.modal__window}`} onClick={(e) => e.stopPropagation()}>
        <div className={`${s.modal__window_content}`}>
          <h6 className={`${g.font_title}`}>Are you sure?</h6>
          <p>You will remove the board and all of its contents.</p>
          <div className={s.buttons__container}>
            <button className={`${g.button} ${g.drop_shadow}`} onClick={deleteOldBoard}>
              OK
            </button>
            <button className={`${g.button} ${g.drop_shadow}`} onClick={closePortal}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalWindow;
