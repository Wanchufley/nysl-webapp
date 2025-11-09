import React from 'react';
import NavigationMenu from './NavigationMenu.jsx';

const Home = ({ user, onSignIn, onSignOut }) => {
  return (
    <NavigationMenu user={user} onSignIn={onSignIn} onSignOut={onSignOut} />
  );
};

export default Home;

