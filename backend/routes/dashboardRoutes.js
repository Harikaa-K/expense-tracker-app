const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

// All routes are protected
router.use(auth);

// @route   GET /api/dashboard/summary
// @desc    Get dashboard summary (total expenses, category breakdown, recent transactions)
// @access  Private
router.get('/summary', async (req, res) => {
    try {
        const userId = req.userId;

        // Get all transactions for the user
        const allTransactions = await Transaction.find({ userId });

        // Calculate total expenses
        const totalExpenses = allTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);

        // Calculate category breakdown
        const categoryBreakdown = allTransactions.reduce((acc, transaction) => {
            const category = transaction.category;
            if (!acc[category]) {
                acc[category] = {
                    category,
                    total: 0,
                    count: 0
                };
            }
            acc[category].total += transaction.amount;
            acc[category].count += 1;
            return acc;
        }, {});

        // Convert to array and sort by total
        const categoryStats = Object.values(categoryBreakdown).sort((a, b) => b.total - a.total);

        // Get recent transactions (last 5)
        const recentTransactions = await Transaction.find({ userId })
            .sort({ date: -1 })
            .limit(5);

        // Get transaction count
        const transactionCount = allTransactions.length;

        // Calculate monthly expenses (current month)
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const monthlyTransactions = await Transaction.find({
            userId,
            date: { $gte: startOfMonth, $lte: endOfMonth }
        });

        const monthlyExpenses = monthlyTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);

        // Calculate average transaction amount
        const averageTransaction = transactionCount > 0 ? totalExpenses / transactionCount : 0;

        res.json({
            success: true,
            summary: {
                totalExpenses: parseFloat(totalExpenses.toFixed(2)),
                transactionCount,
                monthlyExpenses: parseFloat(monthlyExpenses.toFixed(2)),
                averageTransaction: parseFloat(averageTransaction.toFixed(2)),
                categoryBreakdown: categoryStats,
                recentTransactions
            }
        });
    } catch (error) {
        console.error('Dashboard summary error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard summary',
            error: error.message
        });
    }
});

// @route   GET /api/dashboard/stats
// @desc    Get detailed statistics
// @access  Private
router.get('/stats', async (req, res) => {
    try {
        const userId = req.userId;
        const { period = 'month' } = req.query; // month, week, year

        let startDate;
        const now = new Date();

        switch (period) {
            case 'week':
                startDate = new Date(now.setDate(now.getDate() - 7));
                break;
            case 'year':
                startDate = new Date(now.setFullYear(now.getFullYear() - 1));
                break;
            case 'month':
            default:
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        }

        const transactions = await Transaction.find({
            userId,
            date: { $gte: startDate }
        }).sort({ date: 1 });

        // Group by date for chart data
        const dailyExpenses = transactions.reduce((acc, transaction) => {
            const dateKey = transaction.date.toISOString().split('T')[0];
            if (!acc[dateKey]) {
                acc[dateKey] = 0;
            }
            acc[dateKey] += transaction.amount;
            return acc;
        }, {});

        const chartData = Object.entries(dailyExpenses).map(([date, amount]) => ({
            date,
            amount: parseFloat(amount.toFixed(2))
        }));

        res.json({
            success: true,
            stats: {
                period,
                chartData,
                totalTransactions: transactions.length,
                totalAmount: parseFloat(transactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2))
            }
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching statistics',
            error: error.message
        });
    }
});

module.exports = router;
