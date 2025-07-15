import { Provider } from 'react-redux';
import { store } from './redux/store';
import { PlayersPage } from './pages/PlayersPage';
import { TopBar } from './components/TopBar';

export default function App() {
  return (
    <>
      <Provider store={store}>
        <TopBar />
        <PlayersPage />
      </Provider>
    </>
  );
};