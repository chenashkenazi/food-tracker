import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './Login.module.css';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login({ username, password });
      navigate('/');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.formContent}>
          <h2 className={styles.title}>
            Sign in to your account
          </h2>
          <form className={styles.form} onSubmit={handleSubmit}>
            {error && (
              <div className={styles.errorBox}>
                <div className={styles.errorText}>{error}</div>
              </div>
            )}
            <div className={styles.inputGroup}>
              <div className={styles.inputWrapper}>
                <label htmlFor="username" className={styles.label}>
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className={styles.input}
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className={styles.inputWrapper}>
                <label htmlFor="password" className={styles.label}>
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className={styles.input}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className={styles.submitButton}
            >
              Sign in
            </button>

            <div className={styles.switchLink}>
              <Link to="/register" className={styles.switchLinkText}>
                Don't have an account? Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};