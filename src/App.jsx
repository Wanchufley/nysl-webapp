import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home.jsx';
import Schedule from './components/Schedule.jsx';
import { auth } from './firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import GameDetails from './components/GameDetails.jsx';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <Routes>
      <Route path="/" element={<Home user={user} onSignIn={handleSignIn} onSignOut={handleSignOut} />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/game-details/:id" element={<GameDetails />} />
    </Routes>
  );
}

export default App;
