import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../redux/slices/authSlice';
import ResponsiveWrapper from '../components/ResponsiveWrapper';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, userInfo } = useSelector(state => state.auth);
  
  useEffect(() => {
    if (userInfo) {
      navigate('/dashboard');
    }
  }, [userInfo, navigate]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };
  
  return (
    <ResponsiveWrapper>
      <div className="auth-container">
        <div className="auth-card">
          <h2>Login</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <div className="auth-footer">
            <p>Don't have an account? <Link to="/register">Register</Link></p>
            <p><Link to="/forgot-password">Forgot Password?</Link></p>
          </div>
        </div>
      </div>
    </ResponsiveWrapper>
  );
};

export default Login;