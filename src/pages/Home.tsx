import homeImg from '../assets/images/peerCoding.png';
import githubIcon from '../assets/images/githubIcon.svg';

import '../styles/home.scss';

export function Home() {
  return (
    <div id="home-page">
      <aside>
        <img src={homeImg} alt="Illustration for peer coding" />
      </aside>
      <main>
        <div className="wrapper">
          <h1>Code<span>Parner</span></h1>
          <strong>Find a developer to work or study together.</strong>
          <button>
            <img src={githubIcon} alt="Login with gitHub" />
            Log in with gitHub
          </button>
        </div>
      </main>
    </div>
  );
}