// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("https://usermanagementbackendapp-4.onrender.com/api/Authentication/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      let data;
      const contentType = response.headers.get("content-type");
  
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text(); // plain text hata mesajı için
      }
  
      if (response.ok) {
        setMessage("Login successful!");
        localStorage.setItem("token", data.token); // JSON olmalı
        navigate("/userlist");
      } else {
        if (response.status === 401 || response.status === 403 || response.status === 400) {
          setMessage(data || "Invalid email or password.");
        } else {
          setMessage("Login failed.");
        }
      }
    } catch (err) {
      setMessage("Unable to connect to the server.");
    }
  };  

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm p-4">
            <h3 className="text-center mb-4">Login</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Login
              </button>
              {message && <div className="text-danger mt-3 text-center">{message}</div>}
            </form>

            <div className="d-flex justify-content-between mt-3 px-1">
              <span>
                Don't have an account?{' '}
                <button
                  className="btn btn-link p-0 m-0 align-baseline"
                  onClick={() => navigate('/signup')}
                >
                  Sign up
                </button>
              </span>
              <button
                className="btn btn-link p-0 m-0"
                onClick={() => navigate('/forgot-password')}
              >
                Forgot password?
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
