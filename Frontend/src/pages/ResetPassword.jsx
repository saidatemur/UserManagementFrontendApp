import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  // URL'den token çekme
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  const handleReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post('https://usermanagementbackendapp-4.onrender.com/api/Authentication/reset-password', {
        token: token,
        newPassword: newPassword
      });

      setMessage('Password reset successful. Redirecting to login...');
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      console.error(error);
      setMessage('Password reset failed.');
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="card p-4 shadow" style={{ maxWidth: '400px', width: '100%' }}>
        <h4 className="text-center mb-4">Reset Password</h4>
        <form onSubmit={handleReset}>
          <div className="mb-3">
            <label>New Password</label>
            <input
              type="password"
              className="form-control"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>Confirm New Password</label>
            <input
              type="password"
              className="form-control"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-success w-100">Reset Password</button>
        </form>
        {message && <div className="text-center mt-3 text-info">{message}</div>}
      </div>
    </div>
  );
};

export default ResetPassword;
