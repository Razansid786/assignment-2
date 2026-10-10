import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../store/authSlice';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (isLoggedIn) navigate('/events');
    return () => dispatch(clearError());
  }, [isLoggedIn]);

  function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    if (!email.trim()) return setFormError('Email is required');
    if (!password.trim()) return setFormError('Password is required');
    dispatch(loginUser({ email, password }));
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Login</h2>
        {(formError || error) && <p className="error-msg">{formError || error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>
          <button type="submit" className="btn-primary">Login</button>
        </form>
        <p className="auth-switch">No account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
}

export default Login;
