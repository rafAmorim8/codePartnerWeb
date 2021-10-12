import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../App";

import { database } from '../services/firebase';

export function DevList() {
  const { user, logOff } = useContext(AuthContext);
  // const [devList, setDevList] = useState([]);

  useEffect(() => {
    // Get a database reference to our posts
    const userListRef = database.ref('users');

    // Attach an asynchronous callback to read the data at our posts reference
    userListRef.on('value', (snapshot) => {
      console.log(snapshot.val());
    }, (errorObject) => {
      console.log('The read failed: ' + errorObject.name);
    }); 

  }, []);

  async function handleAddUser() {
    const userListRef = database.ref('users');

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
         userListRef.push({
          name: data.name,
          username: data.login,
          email: data.email,
          bio: data.bio,
          avatar: data.avatar_url,
          id: data.id,
          githubRepo: data.html_url,
          website: data.blog,
          location: data.location
        });
      })
      .catch(err => { console.log(err) });

    return;
  }

  return (
    <>
      <header>
        <div className="loggedUserInfo">
          <img src={user?.avatar} alt={user?.name} height={40} width={40} />
          <h2>Hi, {user?.name}</h2>
        </div>

        <button onClick={logOff}>Log off</button>
        <button onClick={handleAddUser}>Add user</button>
      </header>
      <div>
        <h1>Dev List</h1>
        <h2>{user?.name}</h2>
        <p>{user?.token}</p>
      </div>
    </>
  );
}