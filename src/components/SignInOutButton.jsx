import React from 'react';
import './SignInOutButton.css';

const SignInOutButton = ({ user, onSignIn, onSignOut }) => {
  return (
    <div className="auth-container">
      {user ? (
        <button onClick={onSignOut} className="btn btn-primary rounded-pill py-2 fs-5">
          Sign Out
        </button>
      ) : (
        <button onClick={onSignIn} className="btn btn-primary rounded-pill py-2 fs-5">
          Sign In
        </button>
      )}
    </div>
  );
};

export default SignInOutButton;
