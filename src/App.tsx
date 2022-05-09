import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { Auth } from './views/Auth/Auth';
import { Main } from './views/Main/Main';
import { Page404 } from './views/Page404/Page404';
import { PrivateRoute } from './views/PrivateRoute';
import { Welcome } from './views/Welcome/Welcome';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Welcome />} />
        <Route path="auth" element={<Auth />} />
        <Route
          path="main"
          element={
            <PrivateRoute>
              <Main />
            </PrivateRoute>
          }
        />
        <Route path="404" element={<Page404 />} />
        <Route path="*" element={<Navigate to="404" />} />
      </Route>
    </Routes>
  );
};

export default App;
