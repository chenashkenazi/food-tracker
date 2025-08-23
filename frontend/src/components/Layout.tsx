import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, UtensilsCrossed, Target, LogOut, User } from 'lucide-react';
import styles from './Layout.module.css';

export const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <div className={styles.navContent}>
          <div className={styles.navInner}>
            <div className={styles.navLeft}>
              <div className={styles.logo}>
                <h1 className={styles.logoText}>Food Tracker</h1>
              </div>
              <div className={styles.navLinks}>
                <Link
                  to="/"
                  className={styles.navLink}
                >
                  <Home className={styles.navIcon} />
                  Dashboard
                </Link>
                <Link
                  to="/foods"
                  className={styles.navLink}
                >
                  <UtensilsCrossed className={styles.navIcon} />
                  Foods
                </Link>
                <Link
                  to="/goals"
                  className={styles.navLink}
                >
                  <Target className={styles.navIcon} />
                  Goals
                </Link>
              </div>
            </div>
            <div className={styles.navRight}>
              <div className={styles.username}>
                <User className={styles.userIcon} />
                {user?.username}
              </div>
              <button
                onClick={handleLogout}
                className={styles.logoutButton}
              >
                <LogOut className={styles.logoutIcon} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};