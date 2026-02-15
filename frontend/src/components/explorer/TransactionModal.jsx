import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { formatDateForInput, categories } from '../../utils/formatters';
import { FiX } from 'react-icons/fi';
import './TransactionModal.css';

const TransactionModal = ({ transaction, onClose }) => {
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        category: 'Food',
        date: formatDateForInput(new Date()),
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (transaction) {
            setFormData({
                title: transaction.title,
                amount: transaction.amount,
                category: transaction.category,
                date: formatDateForInput(transaction.date),
                notes: transaction.notes || ''
            });
        }
    }, [transaction]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (transaction) {
                // Update existing transaction
                await api.put(`/transactions/${transaction._id}`, formData);
            } else {
                // Create new transaction
                await api.post('/transactions', formData);
            }
            onClose(true); // Close modal and refresh list
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to save transaction');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={() => onClose(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{transaction ? 'Edit Transaction' : 'Add Transaction'}</h2>
                    <button className="modal-close" onClick={() => onClose(false)}>
                        <FiX />
                    </button>
                </div>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="title">Title *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g., Grocery Shopping"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="amount">Amount (₹) *</label>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            placeholder="0.00"
                            step="0.01"
                            min="0.01"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="category">Category *</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group">
                        <label htmlFor="date">Date *</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="notes">Notes (Optional)</label>
                        <textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Add any additional details..."
                            rows="3"
                        />
                    </div>

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => onClose(false)}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : transaction ? 'Update' : 'Add'} Transaction
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionModal;
