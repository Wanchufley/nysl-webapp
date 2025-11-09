import React from 'react';
import { Link } from 'react-router-dom';

const NavigationMenu = ({ user, onSignIn, onSignOut }) => {
  return (
    <div className="container-fluid bg-dark min-vh-100 d-flex justify-content-center align-items-center">
      <div className="card bg-dark text-white border-0 p-4 p-md-5 rounded-4" style={{ maxWidth: '450px', width: '100%' }}>
        <div className="position-absolute top-0 end-0 p-3">
          {user ? (
            <button onClick={onSignOut} className="btn btn-outline-light rounded-pill py-2 fs-5">
              Sign Out
            </button>
          ) : (
            <button onClick={onSignIn} className="btn btn-outline-light rounded-pill py-2 fs-5">
              Sign In
            </button>
          )}
        </div>
        <div className="card-body text-center">
          <h1 className="mb-5 fw-bold display-5">
            <span className="animated-gradient">NYSL APP</span>
          </h1>
          <nav className="d-flex flex-column gap-4">
            <Link to="/schedule" className="btn btn-outline-light rounded-pill py-2 fs-5">
              Schedule
            </Link>
            <Link to="/team" className="btn btn-outline-light rounded-pill py-2 fs-5">
              Team / Profile
            </Link>
            <Link to="/contact" className="btn btn-outline-light rounded-pill py-2 fs-5">
              Contact / Help
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default NavigationMenu;
