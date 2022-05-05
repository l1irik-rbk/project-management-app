import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { setupStore } from './Redux/store';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './App';
import { Welcome } from './components/views/Welcome/Welcome';
import { Page404 } from './components/views/Page404/Page404';
import { Auth } from './components/views/Auth/Auth';

const store = setupStore();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Welcome />} />
            <Route path="auth" element={<Auth />} />
            <Route path="*" element={<Page404 />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
