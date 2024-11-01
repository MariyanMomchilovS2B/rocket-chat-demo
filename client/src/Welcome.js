import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Welcome() {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <div
      className="welcome-container"
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <h2>Welcome to Brand Example</h2>
      <p>Please choose an option to continue:</p>
      <button onClick={handleLoginRedirect} className="welcome-button">
        Login
      </button>
      <button onClick={handleRegisterRedirect} className="welcome-button">
        Register
      </button>
    </div>
  );
}

export default Welcome;
