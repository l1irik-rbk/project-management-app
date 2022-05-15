import { Navigate, Route, Routes } from 'react-router-dom';

import { Layout } from './components/Layout/Layout';
import { useAppSelector } from './Redux/reduxHooks';

import { Auth } from './views/Auth/Auth';
import { Kanban } from './views/Kanban/Kanban';
import { Main } from './views/Main/Main';
import { Page404 } from './views/Page404/Page404';
import { Profile } from './views/Profile/Profile';
import { Welcome } from './views/Welcome/Welcome';

const App = () => {
  const { isTokenLoaded } = useAppSelector((state) => state.appReducer);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={isTokenLoaded ? <Navigate to="/main" /> : <Welcome />} />
        <Route path="auth" element={isTokenLoaded ? <Navigate to="/main" /> : <Auth />} />
        <Route path="main" element={isTokenLoaded ? <Main /> : <Navigate to="/" />} />
        <Route path="profile" element={isTokenLoaded ? <Profile /> : <Navigate to="/" />} />

        <Route path="kanban" element={isTokenLoaded ? <Kanban /> : <Navigate to="/" />}>
          <Route path=":id" element={isTokenLoaded ? <Kanban /> : <Navigate to="/" />} />
        </Route>

        <Route path="*" element={<Page404 />} />
      </Route>
    </Routes>
  );
};

export default App;
