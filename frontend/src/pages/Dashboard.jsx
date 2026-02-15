import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { formatCurrency, formatDate, getCategoryColor, getCategoryIcon } from '../utils/formatters';
import { FiDollarSign, FiTrendingUp, FiCalendar, FiPlus, FiArrowRight } from 'react-icons/fi';
import { FaChartBar, FaFileAlt } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await api.get('/dashboard/summary');
            setSummary(response.data.summary);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex-center" style={{ minHeight: '80vh' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="container">
                <div className="dashboard-header">
                    <div>
                        <h1>Dashboard</h1>
                        <p>Overview of your financial activity</p>
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/transactions')}
                    >
                        <FiPlus /> Add Transaction
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="summary-grid">
                    <div className="summary-card">
                        <div className="summary-icon" style={{ background: 'rgba(99, 102, 241, 0.1)' }}>
                            <FiDollarSign style={{ color: 'var(--primary)' }} />
                        </div>
                        <div className="summary-content">
                            <p className="summary-label">Total Expenses</p>
                            <h2 className="summary-value">{formatCurrency(summary?.totalExpenses || 0)}</h2>
                        </div>
                    </div>

                    <div className="summary-card">
                        <div className="summary-icon" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                            <FiTrendingUp style={{ color: 'var(--success)' }} />
                        </div>
                        <div className="summary-content">
                            <p className="summary-label">Total Transactions</p>
                            <h2 className="summary-value">{summary?.transactionCount || 0}</h2>
                        </div>
                    </div>

                    <div className="summary-card">
                        <div className="summary-icon" style={{ background: 'rgba(236, 72, 153, 0.1)' }}>
                            <FiCalendar style={{ color: 'var(--secondary)' }} />
                        </div>
                        <div className="summary-content">
                            <p className="summary-label">This Month</p>
                            <h2 className="summary-value">{formatCurrency(summary?.monthlyExpenses || 0)}</h2>
                        </div>
                    </div>

                    <div className="summary-card">
                        <div className="summary-icon" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
                            <FiDollarSign style={{ color: 'var(--warning)' }} />
                        </div>
                        <div className="summary-content">
                            <p className="summary-label">Average Transaction</p>
                            <h2 className="summary-value">{formatCurrency(summary?.averageTransaction || 0)}</h2>
                        </div>
                    </div>
                </div>

                {/* Category Breakdown */}
                <div className="dashboard-section">
                    <div className="section-header">
                        <h2>Category Breakdown</h2>
                    </div>

                    {summary?.categoryBreakdown && summary.categoryBreakdown.length > 0 ? (
                        <div className="category-grid">
                            {summary.categoryBreakdown.map((cat) => (
                                <div key={cat.category} className="category-card">
                                    <div className="category-header">
                                        <span className="category-icon">{React.createElement(getCategoryIcon(cat.category))}</span>
                                        <span className="category-name">{cat.category}</span>
                                    </div>
                                    <div className="category-amount" style={{ color: getCategoryColor(cat.category) }}>
                                        {formatCurrency(cat.total)}
                                    </div>
                                    <div className="category-count">{cat.count} transactions</div>
                                    <div className="category-bar">
                                        <div
                                            className="category-bar-fill"
                                            style={{
                                                width: `${(cat.total / summary.totalExpenses) * 100}%`,
                                                background: getCategoryColor(cat.category)
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon"><FaChartBar /></div>
                            <p>No category data available</p>
                        </div>
                    )}
                </div>

                {/* Recent Transactions */}
                <div className="dashboard-section">
                    <div className="section-header">
                        <h2>Recent Transactions</h2>
                        <button
                            className="btn btn-secondary"
                            onClick={() => navigate('/transactions')}
                        >
                            View All <FiArrowRight />
                        </button>
                    </div>

                    {summary?.recentTransactions && summary.recentTransactions.length > 0 ? (
                        <div className="transactions-list">
                            {summary.recentTransactions.map((transaction) => (
                                <div key={transaction._id} className="transaction-item">
                                    <div className="transaction-icon">
                                        {React.createElement(getCategoryIcon(transaction.category))}
                                    </div>
                                    <div className="transaction-details">
                                        <h4>{transaction.title}</h4>
                                        <p>{formatDate(transaction.date)}</p>
                                    </div>
                                    <div className="transaction-category">
                                        <span
                                            className="badge"
                                            style={{
                                                background: `${getCategoryColor(transaction.category)}20`,
                                                color: getCategoryColor(transaction.category)
                                            }}
                                        >
                                            {transaction.category}
                                        </span>
                                    </div>
                                    <div className="transaction-amount">
                                        {formatCurrency(transaction.amount)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon"><FaFileAlt /></div>
                            <p>No transactions yet</p>
                            <button
                                className="btn btn-primary mt-2"
                                onClick={() => navigate('/transactions')}
                            >
                                <FiPlus /> Add Your First Transaction
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
