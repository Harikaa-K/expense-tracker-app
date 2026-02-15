import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiList, FiLogOut, FiUser } from 'react-icons/fi';
import { FaWallet } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!isAuthenticated) {
        return null;
    }

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="container">
                <div className="navbar-content">
                    <Link to="/dashboard" className="navbar-brand">
                        <span className="brand-icon"><FaWallet /></span>
                        <span className="brand-text">Expense Tracker</span>
                    </Link>

                    <div className="navbar-links">
                        <Link
                            to="/dashboard"
                            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                        >
                            <FiHome />
                            <span>Dashboard</span>
                        </Link>
                        <Link
                            to="/transactions"
                            className={`nav-link ${isActive('/transactions') ? 'active' : ''}`}
                        >
                            <FiList />
                            <span>Transactions</span>
                        </Link>
                    </div>

                    <div className="navbar-user">
                        <div className="user-info">
                            <FiUser />
                            <span>{user?.name}</span>
                        </div>
                        <button onClick={handleLogout} className="btn-logout">
                            <FiLogOut />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
