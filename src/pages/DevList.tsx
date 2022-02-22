import { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import { useAuth } from "../hooks/useAuth";
import axios from 'axios';

import toast from 'react-hot-toast';

import { auth, database } from '../services/firebase';

import { Button } from "../components/Button";
import { GithubIcon } from "../components/GithubIcon";
import { LinkIcon } from "../components/LinkIcon";

import '../styles/devList.scss';

type FirebaseUser = Record<string, {
  name: string;
  username: string;
  email: string;
  bio: string;
  avatar: string;
  githubId: string;
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
  githubId: string;
  id: string;
  githubRepo: string;
  website: string;
  location: string;
}

export function DevList() {
  const { user, token, setUser, signInWithGithub } = useAuth();
  const [newUser, setNewUser] = useState<User>();
  const [update, setUpdate] = useState<boolean>(false);
  const [devList, setDevList] = useState<User[]>([]);
  const history = useHistory();

  async function getGithubData(token: string): Promise<User | undefined> {
    let headers = {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `token ${token}`
    };

    const response = await axios.get(`https://api.github.com/user`, {
      headers: headers,
    });

    if (!response.data) {
      return undefined;
    }

    const data = response.data;

    return ({
      name: data.name,
      username: data.login,
      email: data.email,
      bio: data.bio,
      avatar: data.avatar_url,
      id: data.node_id,
      githubId: data.id,
      githubRepo: data.html_url,
      website: data.blog,
      location: data.location
    })
  }

  useEffect(() => {
    if (user) {
      database.ref('users').once('value', userList => {
        const databaseUsers: FirebaseUser = userList.val();

        if (!databaseUsers) {
          return
        }

        const parsedUsers = Object.entries(databaseUsers).map(([key, value]) => {
          return {
            name: value.name,
            username: value.username,
            email: value.email,
            bio: value.bio,
            avatar: value.avatar,
            githubId: value.githubId,
            id: key,
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
  }, [user, update]);

  async function handleAddUser() {
    if (!token) {
      await signInWithGithub();
    }

    if (token) {
      let githubUser = await getGithubData(token);

      if (!githubUser) {
        return;
      }

      const userExists = devList.find(({ username }) => username == githubUser?.username);

      if (userExists) {
        toast.error("User already exists in the Developers list.");
        return;
      }

      setNewUser({ ...githubUser });

      database.ref('users').push({ ...githubUser })
        .then(() => {
          // console.log(newUser?.email);
          toast.success("User added to Dev List!");
          setUpdate(!update);
        })
        .catch((err) => toast.error(err.message));

      return;
    }
  }

  async function logOff() {
    await auth.signOut();
    setUser(undefined);
    history.push("/");
  }

  async function handleRemoveUser() {
    if (!user) {
      throw new Error("User not defined.");
    }

    const userIndex = devList.findIndex(({ githubId }) => githubId == user.githubId);

    if (userIndex < 0) {
      toast.error("User not found");
      return;
    }

    const userDbKey = devList[userIndex].id;

    database.ref().child(`users/${userDbKey}`).remove((err) => {
      if (err) {
        toast.error(err.message);
      } else {
        toast.success("User sucessfuly deleted");
        setUpdate(!update);
      }
    })
  }

  return (
    <>
      <header>
        <div className="loggedUserInfo">
          <img src={user?.avatar} alt={user?.name} height={40} width={40} />
          <h2>{user?.name}</h2>
        </div>
        <div className="headerButtons">
          <Button onClick={handleAddUser}>Add User</Button>
          <Button onClick={logOff}>Log off</Button>
          <Button onClick={handleRemoveUser}>Remove user</Button>
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
                      <a href={dev.githubRepo}>
                        <GithubIcon />
                      </a>
                      <a href={`http://${dev.website}`}>
                        <LinkIcon />
                      </a>
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