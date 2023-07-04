
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';

import { store } from './store';
import App from './App';
import history from './routes/history';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <HistoryRouter history={history}>
      <App />
    </HistoryRouter>
  </Provider>
);