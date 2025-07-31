import React from 'react';
import {Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import UserList from "./pages/UserList";
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <Routes>
      
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/userlist" element={<UserList />} />
        <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
}

export default App;
