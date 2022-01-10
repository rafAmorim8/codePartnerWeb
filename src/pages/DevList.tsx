import { useContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import { AuthContext } from "../App";

import { auth, database } from '../services/firebase';
import { getDatabase, onValue, ref, set } from "firebase/database";

import '../styles/devList.scss';

type FirebaseUser = Record<string, {
  name: string;
  username: string;
  email: string;
  bio: string;
  avatar: string;
  id: string;
  githubRepo: string;
  website: string;
  location: string;
}>

type User = {
  name: string;
  username: string;
  email: string;
  bio: string;
  avatar: string;
  id: string;
  githubRepo: string;
  website: string;
  location: string;
}

export function DevList() {
  const { user, setUser } = useContext(AuthContext);
  const [newUser, setNewUser] = useState<User>();
  const [devList, setDevList] = useState<User[]>([]);
  const history = useHistory();

  useEffect(() => {
    const userListRef = database.ref('users');

    if (user) {
      userListRef.on('value', userList => {
        const databaseUsers: FirebaseUser = userList.val();

        const parsedUsers = Object.entries(databaseUsers).map(([key, value]) => {
          return {
            name: value.name,
            username: value.username,
            email: value.email,
            bio: value.bio,
            avatar: value.avatar,
            id: value.id,
            githubRepo: value.githubRepo,
            website: value.website,
            location: value.location,
          }
        });

        setDevList(parsedUsers);
      }, (errorObject) => {
        console.log('The read failed: ' + errorObject.name);
      });
    }
  }, [user]);

  async function handleAddUser() {
    const usersDb = getDatabase();

    //Get github data from authenticated user 
    let headers = new Headers({
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `token ${user?.token}`
    });

    await fetch(`https://api.github.com/user`, {
      method: 'GET',
      headers: headers
    })
      .then(result => result.json())
      .then(data => {
        setNewUser({
          name: data.name,
          username: data.login,
          email: data.email,
          bio: data.bio,
          avatar: data.avatar_url,
          id: data.id,
          githubRepo: data.html_url,
          website: data.blog,
          location: data.location,
        });
      })
      .then(() => {
        if (newUser) {
          const userRef = ref(usersDb, 'users/' + newUser.id);

          //Checks if user is in the database alreay before adding them
          onValue(userRef, (snapshot) => {
            if (!snapshot.exists()) {
              set(ref(usersDb, 'users/' + newUser.id), {
                name: newUser.name,
                username: newUser.username,
                email: newUser.email,
                bio: newUser.bio,
                avatar: newUser.avatar,
                id: newUser.id,
                githubRepo: newUser.githubRepo,
                website: newUser.website,
                location: newUser.location
              });
            } else {
              console.log('User already exists in the database');
            };
          });
        }
      })
      .catch(err => { console.log(err) });

    return;
  }

  async function logOff() {
    await auth.signOut();
    setUser(undefined);
    history.push("/");
  }

  return (
    <>
      <header>
        <div className="loggedUserInfo">
          <img src={user?.avatar} alt={user?.name} height={40} width={40} />
          <h2>{user?.name}</h2>
        </div>
        <div className="headerButtons">
          <button onClick={logOff}>Log off</button>
          <button onClick={handleAddUser}>Add user</button>
        </div>
      </header>
      <main>
        <h1>List of Developers</h1>
        <div className="devsContainer">
          {
            (devList.length === 0) ? (
              <p>No devs registered.</p>
            ) : (
              devList.map(dev => {
                return (
                  <div className="devCard" key={dev.id}>
                    <div className="devCardHeader">
                      <img src={dev.avatar} alt={dev.name} />
                      <h3>{dev.name}</h3>
                    </div>
                    <p><strong>Bio: </strong>{dev.bio}</p>
                    <p><strong>Location: </strong>{dev.location}</p>
                    <p><strong>Email: </strong>{dev.email}</p>
                    <div className="devLinks">
                      <a href={dev.githubRepo}>Github</a>
                      <a href={dev.website}>Website</a>
                    </div>
                  </div>
                )
              })
            )}
        </div>
      </main>
    </>
  );
}