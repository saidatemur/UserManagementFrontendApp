import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://usermanagementbackendapp-4.onrender.com/api/Authentication/forgot-password', {
        email: email
      });
      console.log("Token:", response.data.token); // Eğer backend token dönerse
      setMessage('Reset link sent. Check console for token.');
        navigate(`/reset-password?token=${response.data.token}`);
    } catch (error) {
      setMessage('Error sending reset link.');
      console.error(error);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="card p-4 shadow" style={{ maxWidth: '400px', width: '100%' }}>
        <h4 className="text-center mb-4">Forgot Password</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Email address</label>
            <input
              type="email"
              className="form-control"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-warning w-100">Send Reset Link</button>
        </form>
        {message && <div className="text-center mt-3 text-success">{message}</div>}
        <div className="text-center mt-3">
          <button className="btn btn-link p-0" onClick={() => navigate('/')}>
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
