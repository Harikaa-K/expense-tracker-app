import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { formatCurrency, formatDate, formatDateForInput, getCategoryColor, getCategoryIcon, categories } from '../utils/formatters';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiFilter, FiX } from 'react-icons/fi';
import { FaFileAlt } from 'react-icons/fa';
import TransactionModal from '../components/explorer/TransactionModal';
import './TransactionExplorer.css';

const TransactionExplorer = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [pagination, setPagination] = useState({});

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchTransactions();
    }, [searchTerm, selectedCategory, startDate, endDate, currentPage]);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const params = {
                page: currentPage,
                limit: 10,
                search: searchTerm,
                category: selectedCategory,
                startDate,
                endDate,
                sortBy: 'date',
                sortOrder: 'desc'
            };

            const response = await api.get('/transactions', { params });
            setTransactions(response.data.transactions);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTransaction = () => {
        setEditingTransaction(null);
        setShowModal(true);
    };

    const handleEditTransaction = (transaction) => {
        setEditingTransaction(transaction);
        setShowModal(true);
    };

    const handleDeleteTransaction = async (id) => {
        if (!window.confirm('Are you sure you want to delete this transaction?')) {
            return;
        }

        try {
            await api.delete(`/transactions/${id}`);
            fetchTransactions();
        } catch (error) {
            console.error('Error deleting transaction:', error);
            alert('Failed to delete transaction');
        }
    };

    const handleModalClose = (shouldRefresh) => {
        setShowModal(false);
        setEditingTransaction(null);
        if (shouldRefresh) {
            fetchTransactions();
        }
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('All');
        setStartDate('');
        setEndDate('');
        setCurrentPage(1);
    };

    const hasActiveFilters = searchTerm || selectedCategory !== 'All' || startDate || endDate;

    return (
        <div className="explorer-container">
            <div className="container">
                <div className="explorer-header">
                    <div>
                        <h1>Transaction Explorer</h1>
                        <p>Manage and explore your transaction history</p>
                    </div>
                    <button className="btn btn-primary" onClick={handleAddTransaction}>
                        <FiPlus /> Add Transaction
                    </button>
                </div>

                {/* Filters */}
                <div className="filters-section">
                    <div className="search-box">
                        <FiSearch />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>

                    <select
                        value={selectedCategory}
                        onChange={(e) => {
                            setSelectedCategory(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="filter-select"
                    >
                        <option value="All">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>

                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => {
                            setStartDate(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="filter-date"
                        placeholder="Start Date"
                    />

                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => {
                            setEndDate(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="filter-date"
                        placeholder="End Date"
                    />

                    {hasActiveFilters && (
                        <button className="btn btn-secondary" onClick={clearFilters}>
                            <FiX /> Clear Filters
                        </button>
                    )}
                </div>

                {/* Transactions List */}
                {loading ? (
                    <div className="flex-center" style={{ minHeight: '400px' }}>
                        <div className="spinner"></div>
                    </div>
                ) : transactions.length > 0 ? (
                    <>
                        <div className="transactions-grid">
                            {transactions.map((transaction) => (
                                <div key={transaction._id} className="transaction-card">
                                    <div className="transaction-card-header">
                                        <div className="transaction-card-icon">
                                            {React.createElement(getCategoryIcon(transaction.category))}
                                        </div>
                                        <div className="transaction-card-info">
                                            <h3>{transaction.title}</h3>
                                            <p>{formatDate(transaction.date)}</p>
                                        </div>
                                        <div className="transaction-card-actions">
                                            <button
                                                className="icon-btn edit-btn"
                                                onClick={() => handleEditTransaction(transaction)}
                                                title="Edit"
                                            >
                                                <FiEdit2 />
                                            </button>
                                            <button
                                                className="icon-btn delete-btn"
                                                onClick={() => handleDeleteTransaction(transaction._id)}
                                                title="Delete"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="transaction-card-body">
                                        <div className="transaction-card-amount">
                                            {formatCurrency(transaction.amount)}
                                        </div>
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

                                    {transaction.notes && (
                                        <div className="transaction-card-notes">
                                            <p>{transaction.notes}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>
                                <span className="pagination-info">
                                    Page {pagination.currentPage} of {pagination.totalPages}
                                    <span className="pagination-total">
                                        ({pagination.totalTransactions} total)
                                    </span>
                                </span>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    disabled={!pagination.hasMore}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon"><FaFileAlt /></div>
                        <h3>No transactions found</h3>
                        <p>
                            {hasActiveFilters
                                ? 'Try adjusting your filters'
                                : 'Start by adding your first transaction'}
                        </p>
                        {!hasActiveFilters && (
                            <button className="btn btn-primary mt-2" onClick={handleAddTransaction}>
                                <FiPlus /> Add Transaction
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <TransactionModal
                    transaction={editingTransaction}
                    onClose={handleModalClose}
                />
            )}
        </div>
    );
};

export default TransactionExplorer;
