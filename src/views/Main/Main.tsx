import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { fetchBoards } from '../../Redux/actionCreators/fetchBoards';
import { useAppDispatch, useAppSelector } from '../../Redux/reduxHooks';
import { Boards } from './components/Boards';
import { CreateNewBoard } from './components/CreateNewBoard';

export const Main = () => {
  const { t } = useTranslation();
  const { newBoard, isBoardsLoaded } = useAppSelector((state) => state.boards);
  const dispatch = useAppDispatch();

  useEffect(() => {
    document.title = `${t('main.docTitle')} | KanbanBoar`;

    if (!isBoardsLoaded) {
      dispatch(fetchBoards());
    }
  }, [dispatch, isBoardsLoaded]);

  return (
    <>
      {newBoard && <CreateNewBoard />}
      <Boards />
    </>
  );
};
