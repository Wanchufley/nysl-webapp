import NavigationMenu from './NavigationMenu.jsx';
import { Link } from 'react-router-dom';

const NavigationBar = ({ user, onSignIn, onSignOut }) => {
  return (
    <div className="d-flex justify-content-between align-items-center p-3">
      <div>
        <Link to="/" className="btn btn-outline-light rounded-pill py-2 fs-5">
          Home
        </Link>
      </div>
      <div>
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
    </div>
  )
}

export default NavigationBar
