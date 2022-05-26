import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Spinner } from '../../components/Spinner/Spinner';

import { useAppDispatch, useAppSelector } from '../../Redux/hooks';
import { fetchBoardsThunk } from '../../Redux/slices/boardsSlice';
// import { fetchBoards } from '../../Redux/slices/boardsSlice';
import { Boards } from './components/Boards';
import { CreateNewBoard } from './components/CreateNewBoard';

export const Main = () => {
  const { t } = useTranslation();
  const { isOpenModalCreateNewBoard, isBoardsLoaded } = useAppSelector((state) => state.boards);
  const dispatch = useAppDispatch();

  useEffect(() => {
    document.title = `${t('main.docTitle')} | KanbanBoar`;

    if (!isBoardsLoaded) dispatch(fetchBoardsThunk());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isBoardsLoaded]);

  return (
    <>
      {isOpenModalCreateNewBoard && <CreateNewBoard />}
      {isBoardsLoaded ? <Boards /> : <Spinner />}
    </>
  );
};
