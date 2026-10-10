import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../store/authSlice';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, error } = useSelector((state) => state.auth);

  const [name, setName] = useState('');
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
    if (!name.trim()) return setFormError('Name is required');
    if (!email.trim()) return setFormError('Email is required');
    if (password.length < 6) return setFormError('Password must be at least 6 characters');
    dispatch(registerUser({ name, email, password }));
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create Account</h2>
        {(formError || error) && <p className="error-msg">{formError || error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>
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
              placeholder="Min 6 characters"
            />
          </div>
          <button type="submit" className="btn-primary">Register</button>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}

export default Register;
