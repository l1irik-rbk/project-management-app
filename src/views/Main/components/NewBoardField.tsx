import React, { useState } from 'react';

import s from '../Main.module.scss';
import g from '../../../App.module.scss';
import { useAppDispatch, useAppSelector } from '../../../Redux/reduxHooks';
import { appSlice } from '../../../Redux/toolkitSlice';
import { createBoard } from '../../../services/boards';
import { fetchBoards } from '../../../Redux/actionCreators/fetchBoards';

export const NewBoardField = () => {
  const [inputValue, setInputValue] = useState('');
  const { boards } = useAppSelector((state) => state.appReducer);
  const { newBoard } = boards;
  const dispatch = useAppDispatch();
  const { setNewBoard } = appSlice.actions;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const handleCreateNewBoard = async () => {
    await createBoard(inputValue);
    dispatch(setNewBoard(false));
    dispatch(fetchBoards());
  };

  const handleCancelCreateNewBoard = () => {
    dispatch(setNewBoard(!newBoard));
  };

  return (
    <div className={`${s.boards}`}>
      <h2>Create a new board</h2>
      <div className={`${s.board} ${s.board__new}`}>
        <input
          className={s.input}
          type="text"
          placeholder="Enter board title"
          value={inputValue}
          onChange={handleChange}
        />
        <div className={s.buttons}>
          <button className={`${g.button} ${g.drop_shadow}`} onClick={handleCreateNewBoard}>
            Create
          </button>
          <button className={`${g.button} ${g.drop_shadow}`} onClick={handleCancelCreateNewBoard}>
            X
          </button>
        </div>
      </div>
    </div>
  );
};
