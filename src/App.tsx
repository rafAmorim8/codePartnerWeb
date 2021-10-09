import { createContext, useEffect, useState } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import { auth, firebase } from './services/firebase';

import { Home } from './pages/Home';
import { DevList } from './pages/DevList';

type User = {
  name: string,
  email: string | null,
  avatar: string,
  id: string,
}

type AuthContextType = {
  user: User | undefined;
  signInWithGithub: () => Promise<void>; //all async functions return a Promise
}

export const AuthContext = createContext({} as AuthContextType);

function App() {
  const [user, setUser] = useState<User>();

  //Check if an user has already logged in before the app starts
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        const { displayName, photoURL, uid, email } = user;

        if (!displayName || !photoURL) {
          throw new Error('Missing information from Google Account.');
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL,
          email: email
        });
      }
    })

    //unsubscibe from Auth event listener to avoid errors
    return () => {
      unsubscribe();
    }
  }, []);

  async function signInWithGithub() {
    const provider = new firebase.auth.GithubAuthProvider();

    const result = await auth.signInWithPopup(provider);

    if (result.user) {
      const { displayName, email, photoURL, uid } = result.user;

      if (!displayName || !photoURL) {
        throw new Error('Missing information from Github Account');
      }

      setUser({
        name: displayName,
        email: email,
        avatar: photoURL,
        id: uid
      });
    }
  }

  return (
    <BrowserRouter>
      <AuthContext.Provider value={{ user, signInWithGithub }}>
        <Route path="/" exact component={Home} />
        <Route path="/devList" exact component={DevList} />
      </AuthContext.Provider>
    </BrowserRouter>
  );
}

export default App;
