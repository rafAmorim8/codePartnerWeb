import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../App";

import { database } from '../services/firebase';

export function DevList() {
  const { user } = useContext(AuthContext);
  // const [devList, setDevList] = useState([]);

  useEffect(() => {
    console.log(user);
  }, []);

  async function handleAddUser() {
    const userListRef = database.ref('userList');

    let headers = new Headers({
      'Accept': 'application/jsonp',
      'Content-Type': 'application/jsonp',
      'Authorization': `${user?.token}`
    });

    fetch(`https://api.github.com/user`, {
      method: 'GET',
      headers: headers
    }).then(result => {
      console.log(result);
    }).catch(err => { console.log(err) });

    // const firebaseUser = await userListRef.push({
    //   name: user?.name,
    //   avatar: user?.avatar,
    //   email: user?.email,
    //   id: user?.id,
    //   username: 'teste',
    //   githubRepo: 'www',
    //   description: 'developer'
    // });

    return;
  }

  async function handleLogOff() {

    return;
  }

  return (
    <>
      <header>
        <div className="loggedUserInfo">
          <img src={user?.avatar} alt={user?.name} height={40} width={40} />
          <h2>Hi, {user?.name}</h2>
        </div>

        <button onClick={handleLogOff}>Log off</button>
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