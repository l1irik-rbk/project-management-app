import { Outlet } from 'react-router-dom';

import { Footer } from '../Footer/Footer';
import { Header } from '../Header/Header';
import s from '../../App.module.scss';

export const Layout = () => {
  return (
    <>
      <Header />
      <main className={`${s.main} ${s.wrapper}`}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};
