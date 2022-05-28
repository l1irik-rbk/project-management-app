import { Outlet, useLocation } from 'react-router-dom';

import { Footer } from '../Footer/Footer';
import { Header } from '../Header/Header';
import s from '../../App.module.scss';
import { ConfirmationModal } from '../ConfirmationModal/ConfirmationModal';

export const Layout = () => {
  const location = useLocation();
  const isKanban = location.pathname.includes('kanban');

  return (
    <>
      <Header />

      <main className={`${s.main} ${isKanban ? s.kanban : s.wrapper}`}>
        <Outlet />
        <ConfirmationModal />
      </main>

      <Footer />
    </>
  );
};
