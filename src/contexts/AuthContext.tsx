import { createContext, ReactNode, useEffect, useState } from "react";
import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, firebase } from "../services/firebase";

type User = {
  name: string,
  email: string | null,
  avatar: string,
  id: string,
  githubId?: string,
  token?: string | undefined,
  username?: string,
  bio?: string,
  githubRepo?: string,
  website?: string,
  location?: string
}

type AuthContextType = {
  user: User | undefined;
  token: string | undefined;
  setUser: (value: User | undefined) => void;
  signInWithGithub: () => Promise<void>; //all async functions return a Promise
}

type AuthContextProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {
  const [user, setUser] = useState<User>();
  const [token, setToken] = useState<string>();

  // Check if an user has already logged in before the app starts
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async user => {
      if (user) {
        const { displayName, photoURL, uid, email } = user;
        const githubUserId = user.providerData[0]?.uid;

        if (!displayName || !photoURL) {
          throw new Error('Missing information from Google Account.');
        }

        setUser({
          id: uid,
          name: displayName,
          githubId: githubUserId,
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

    signInWithPopup(auth, provider).then((result) => {
      const credential = GithubAuthProvider.credentialFromResult(result);

      if (result.user) {
        const { displayName, email, photoURL, uid } = result.user;
        const githubUserId = result.user.providerData[0]?.uid;

        if (!displayName || !photoURL) {
          throw new Error('Missing information from Github Account');
        }

        if (credential != null) {
          setToken(credential.accessToken);
        }

        if (!token) {
          return;
        }


        setUser({
          name: displayName,
          email,
          githubId: githubUserId,
          avatar: photoURL,
          id: uid
        });
      }
    })
      .catch((err) => alert(err));
  }
  return (
    <AuthContext.Provider value={{ user, token, signInWithGithub, setUser }}>
      {props.children}
    </AuthContext.Provider>
  );
}