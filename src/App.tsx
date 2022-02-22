import { BrowserRouter, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { Home } from './pages/Home';
import { DevList } from './pages/DevList';

import { AuthContextProvider } from './contexts/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Toaster toastOptions={{
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }}
        />
        <Route path="/" exact component={Home} />
        <Route path="/devList" exact component={DevList} />
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
