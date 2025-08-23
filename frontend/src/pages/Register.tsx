import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './Register.module.css';

export const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await register({ email, username, password });
      navigate('/');
    } catch (err: any) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.detail || 
                          err.message || 
                          'Registration failed. Please check if the backend is running on http://localhost:8000';
      setError(errorMessage);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.formContent}>
          <h2 className={styles.title}>
            Create your account
          </h2>
          <form className={styles.form} onSubmit={handleSubmit}>
            {error && (
              <div className={styles.errorBox}>
                <div className={styles.errorText}>{error}</div>
              </div>
            )}
            <div className={styles.inputGroup}>
              <div className={styles.inputWrapper}>
                <label htmlFor="email" className={styles.label}>
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className={styles.input}
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
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
              <div className={styles.inputWrapper}>
                <label htmlFor="confirmPassword" className={styles.label}>
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className={styles.input}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className={styles.submitButton}
            >
              Sign up
            </button>

            <div className={styles.switchLink}>
              <Link to="/login" className={styles.switchLinkText}>
                Already have an account? Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};