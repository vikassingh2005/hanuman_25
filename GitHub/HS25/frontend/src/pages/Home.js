import React from 'react';
import { Link } from 'react-router-dom';
import ResponsiveWrapper from '../components/ResponsiveWrapper';

const Home = () => {
  return (
    <ResponsiveWrapper>
      <div className="container">
        <div className="hero-section">
          <h1>Welcome to Our Application</h1>
          <p>A comprehensive full-stack solution for your business needs</p>
          <div className="cta-buttons">
            <Link to="/login" className="btn btn-primary">Login</Link>
            <Link to="/register" className="btn btn-outline">Register</Link>
          </div>
        </div>

        <div className="features-section">
          <h2>Key Features</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <h3>User Management</h3>
              <p>Secure authentication and profile management</p>
            </div>
            <div className="feature-card">
              <h3>Data Operations</h3>
              <p>Efficient data handling and storage</p>
            </div>
            <div className="feature-card">
              <h3>Responsive Design</h3>
              <p>Optimized for all devices and screen sizes</p>
            </div>
          </div>
        </div>
      </div>
    </ResponsiveWrapper>
  );
};

export default Home;