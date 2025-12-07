import { Link } from 'react-router-dom';

const NavigationBar = ({ user, onSignIn, onSignOut, currentGameId }) => {
  return (
    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 p-3 w-100">
      <div className="d-flex flex-wrap align-items-center gap-2">
        <Link to="/" className="btn btn-outline-light rounded-pill py-2 px-3">
          Home
        </Link>
        {user && currentGameId && (
          <>
            <Link
              to={`/game-details/${currentGameId}/messages`}
              className="btn btn-outline-light rounded-pill py-2 px-3"
            >
              Messages
            </Link>
            <Link
              to={`/game-details/${currentGameId}/photos`}
              className="btn btn-outline-light rounded-pill py-2 px-3"
            >
              Photos
            </Link>
          </>
        )}
      </div>
      <div className="d-flex justify-content-end">
        {user ? (
          <button
            onClick={onSignOut}
            className="btn btn-outline-light rounded-pill py-2 px-3"
          >
            Sign Out
          </button>
        ) : (
          <button
            onClick={onSignIn}
            className="btn btn-outline-light rounded-pill py-2 px-3"
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  );
};

export default NavigationBar;
