import { useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

import homeImg from '../assets/images/peerCoding.png';
import githubIcon from '../assets/images/githubIcon.svg';

import '../styles/home.scss';

export function Home() {
  const history = useHistory();
  const { signInWithGithub, user } = useAuth();

  async function signIn() {
    if (!user) {
      await signInWithGithub();
    }

    history.push(`/devList`);
  }

  return (
    <div id="home-page">
      <aside>
        <img src={homeImg} alt="Illustration for peer coding" />
      </aside>
      <main>
        <div className="wrapper">
          <h1>Code<span>Parner</span></h1>
          <h2>{user?.name}</h2>
          <strong>Find a developer to work or study together.</strong>
          <button onClick={signIn}>
            <img src={githubIcon} alt="Login with gitHub" />
            Log in with gitHub
          </button>
        </div>
      </main>
    </div>
  );
}