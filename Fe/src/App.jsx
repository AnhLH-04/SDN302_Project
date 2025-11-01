import AppRouter from './AppRouter';
import { FavoritesProvider } from '@utils/FavoritesContext.jsx';
import { CompareProvider } from '@utils/CompareContext.jsx';

function App() {
  return (
    <FavoritesProvider>
      <CompareProvider>
        <AppRouter />
      </CompareProvider>
    </FavoritesProvider>
  );
}

export default App;
