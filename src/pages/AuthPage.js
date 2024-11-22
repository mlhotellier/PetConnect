import React, { useState } from 'react';
import '../styles/styles.css';

const AuthPage = ({ setIsLogged }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    setIsLogged(true);
  };

  return (
    <div className='container auth-page'>
        <h1>Se connecter</h1>
        <form onSubmit={handleSubmit} className="log-form">
            <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    />
            </div>
            <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
            </div>
            <button type="submit">Submit</button>
        </form>
    </div>
  );
};

export default AuthPage;
