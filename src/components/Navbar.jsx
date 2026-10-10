import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/authSlice';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  function handleLogout() {
    dispatch(logoutUser());
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <Link to="/events" className="nav-logo">EventHub</Link>
      <div className="nav-links">
        <Link to="/events">Events</Link>
        {isLoggedIn && <Link to="/my-events">My Events</Link>}
        {isLoggedIn ? (
          <>
            <span className="nav-user">Hi, {user.name}</span>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
