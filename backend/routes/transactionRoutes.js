const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

// All routes are protected
router.use(auth);

// Validation middleware
const validateTransaction = [
    body('title').trim().isLength({ min: 2, max: 100 }).withMessage('Title must be between 2 and 100 characters'),
    body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
    body('category').isIn(['Food', 'Transport', 'Rent', 'Entertainment', 'Healthcare', 'Shopping', 'Utilities', 'Education', 'Other']).withMessage('Invalid category'),
    body('date').optional().isISO8601().withMessage('Invalid date format'),
    body('notes').optional().trim().isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters')
];

// @route   GET /api/transactions
// @desc    Get all transactions for user with pagination, search, and filters
// @access  Private
router.get('/', async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = '',
            category = '',
            startDate = '',
            endDate = '',
            sortBy = 'date',
            sortOrder = 'desc'
        } = req.query;

        // Build query
        const query = { userId: req.userId };

        // Search filter
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { notes: { $regex: search, $options: 'i' } }
            ];
        }

        // Category filter
        if (category && category !== 'All') {
            query.category = category;
        }

        // Date range filter
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        // Sort options
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Execute query with pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const transactions = await Transaction.find(query)
            .sort(sortOptions)
            .limit(parseInt(limit))
            .skip(skip);

        // Get total count for pagination
        const total = await Transaction.countDocuments(query);

        res.json({
            success: true,
            transactions,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalTransactions: total,
                hasMore: skip + transactions.length < total
            }
        });
    } catch (error) {
        console.error('Get transactions error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching transactions',
            error: error.message
        });
    }
});

// @route   GET /api/transactions/:id
// @desc    Get single transaction
// @access  Private
router.get('/:id', async (req, res) => {
    try {
        const transaction = await Transaction.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        res.json({
            success: true,
            transaction
        });
    } catch (error) {
        console.error('Get transaction error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching transaction',
            error: error.message
        });
    }
});

// @route   POST /api/transactions
// @desc    Create new transaction
// @access  Private
router.post('/', validateTransaction, async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { title, amount, category, date, notes } = req.body;

        const transaction = new Transaction({
            userId: req.userId,
            title,
            amount,
            category,
            date: date || Date.now(),
            notes
        });

        await transaction.save();

        res.status(201).json({
            success: true,
            message: 'Transaction created successfully',
            transaction
        });
    } catch (error) {
        console.error('Create transaction error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating transaction',
            error: error.message
        });
    }
});

// @route   PUT /api/transactions/:id
// @desc    Update transaction
// @access  Private
router.put('/:id', validateTransaction, async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { title, amount, category, date, notes } = req.body;

        const transaction = await Transaction.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { title, amount, category, date, notes },
            { new: true, runValidators: true }
        );

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        res.json({
            success: true,
            message: 'Transaction updated successfully',
            transaction
        });
    } catch (error) {
        console.error('Update transaction error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating transaction',
            error: error.message
        });
    }
});

// @route   DELETE /api/transactions/:id
// @desc    Delete transaction
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        res.json({
            success: true,
            message: 'Transaction deleted successfully'
        });
    } catch (error) {
        console.error('Delete transaction error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting transaction',
            error: error.message
        });
    }
});

module.exports = router;
