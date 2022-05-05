import { Outlet } from 'react-router';

import s from './App.module.scss';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';

const App = () => {
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

export default App;
