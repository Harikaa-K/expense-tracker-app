import { FaUtensils, FaCar, FaHome, FaFilm, FaHeartbeat, FaShoppingBag, FaLightbulb, FaBook, FaTag } from 'react-icons/fa';

// Format currency
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2
    }).format(amount);
};

// Format date
export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

// Format date for input
export const formatDateForInput = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Category colors
export const getCategoryColor = (category) => {
    const colors = {
        Food: '#f59e0b',
        Transport: '#3b82f6',
        Rent: '#8b5cf6',
        Entertainment: '#ec4899',
        Healthcare: '#ef4444',
        Shopping: '#14b8a6',
        Utilities: '#6366f1',
        Education: '#10b981',
        Other: '#6b7280'
    };
    return colors[category] || colors.Other;
};

// Category icons (using Font Awesome icons)
export const getCategoryIcon = (category) => {
    const icons = {
        Food: FaUtensils,
        Transport: FaCar,
        Rent: FaHome,
        Entertainment: FaFilm,
        Healthcare: FaHeartbeat,
        Shopping: FaShoppingBag,
        Utilities: FaLightbulb,
        Education: FaBook,
        Other: FaTag
    };
    const IconComponent = icons[category] || icons.Other;
    return IconComponent;
};

// All categories
export const categories = [
    'Food',
    'Transport',
    'Rent',
    'Entertainment',
    'Healthcare',
    'Shopping',
    'Utilities',
    'Education',
    'Other'
];
