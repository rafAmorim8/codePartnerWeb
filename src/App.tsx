import { BrowserRouter, Route } from 'react-router-dom';

import { Home } from './pages/Home';
import { DevList } from './pages/DevList';

import { AuthContextProvider } from './contexts/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Route path="/" exact component={Home} />
        <Route path="/devList" exact component={DevList} />
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
