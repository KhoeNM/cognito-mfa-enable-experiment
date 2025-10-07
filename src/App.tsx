import {type JSX } from 'react'
import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Home from './components/Home';
import SetupMFA from './components/SetUpMFA';

function App() {
  return (
    <div className="container mx-auto p-4">
      <Routes>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/signin" element={<SignIn />}></Route>
        <Route path="/setup-mfa" element={<ProtectedRoute><SetupMFA /></ProtectedRoute>}></Route>
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>}></Route>
        <Route path="/" element={<Navigate to="/home" />}></Route>
      </Routes>
    </div>
  );
}

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem('accessToken');
  return token ? children : <Navigate to="/signin" />;

}

export default App;
