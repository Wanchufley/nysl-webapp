import React from 'react';
import NavigationMenu from './NavigationMenu.jsx';
import TempData from './TempData.jsx';
import SignInOutButton from './SignInOutButton.jsx';

const Home = ({ user, onSignIn, onSignOut }) => {
  return (
    <div>
      <SignInOutButton user={user} onSignIn={onSignIn} onSignOut={onSignOut} />
      <NavigationMenu />
      <h1>NYSL PWA</h1>
      <div id="test-data">
        <TempData />
      </div>
    </div>
  )
};

export default Home;
