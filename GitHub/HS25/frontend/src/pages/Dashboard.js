import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile } from '../redux/slices/userSlice';
import ResponsiveWrapper from '../components/ResponsiveWrapper';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { userInfo, loading } = useSelector(state => state.user);
  const { userInfo: authUser } = useSelector(state => state.auth);
  
  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);
  
  return (
    <ResponsiveWrapper>
      <div className="dashboard-container">
        <h1>Dashboard</h1>
        
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <>
            <div className="user-info-card">
              <h2>Welcome, {userInfo?.name || authUser?.name}</h2>
              <div className="user-details">
                <p><strong>Email:</strong> {userInfo?.email || authUser?.email}</p>
                <p><strong>Member since:</strong> {new Date(userInfo?.createdAt || authUser?.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="dashboard-grid">
              <div className="dashboard-card">
                <h3>Profile</h3>
                <p>Manage your personal information</p>
                <button className="btn btn-outline">Edit Profile</button>
              </div>
              
              <div className="dashboard-card">
                <h3>Security</h3>
                <p>Update your password and security settings</p>
                <button className="btn btn-outline">Security Settings</button>
              </div>
              
              <div className="dashboard-card">
                <h3>Activity</h3>
                <p>View your recent activity</p>
                <button className="btn btn-outline">View Activity</button>
              </div>
            </div>
          </>
        )}
      </div>
    </ResponsiveWrapper>
  );
};

export default Dashboard;