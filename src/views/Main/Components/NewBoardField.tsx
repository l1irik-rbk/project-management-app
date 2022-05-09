import React, { useState } from 'react';
import s from '../Main.module.scss';
import g from '../../../App.module.scss';
import { useAppDispatch } from '../../../Redux/reduxHooks';
import { appSlice } from '../../../Redux/toolkitSlice';
import { createBoard } from '../../../services/boards';
import { fetchBoards } from '../../../Redux/actionCreators/fetchBoards';

export const NewBoardField = () => {
  const [inputValue, setInputValue] = useState('');
  const dispatch = useAppDispatch();
  const { setNewBoard } = appSlice.actions;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const createNewBoard = async () => {
    await createBoard(inputValue);
    dispatch(setNewBoard(false));
    dispatch(fetchBoards());
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
        <button className={`${g.button} ${g.drop_shadow}`} onClick={createNewBoard}>
          Create
        </button>
      </div>
    </div>
  );
};
