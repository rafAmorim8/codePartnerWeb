import { BrowserRouter, Route } from 'react-router-dom';

import { Home } from './pages/Home';
import { DevList } from './pages/DevList';

function App() {
  return (
    <BrowserRouter>
      <Route path="/" exact component={Home} />
      <Route path="/devList" exact component={DevList} />
    </BrowserRouter>
  );
}

export default App;
