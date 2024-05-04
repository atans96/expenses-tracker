import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { getCurrentUser, fetchCategories, categoriesCollection, expensesCollection, db } from '../../utils/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const ExpenseForm = ({ onClose, expense }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const user = await getCurrentUser();
        const categoriesData = await fetchCategories(user.uid);
        if (categoriesData.length === 0) {
          setShowNewCategoryInput(true);
        } else {
          setCategories(categoriesData);
        }
        // Pre-populate form fields if expense data is provided
        if (expense) {
          setDescription(expense.description);
          setAmount(expense.amount.toString());
          setCategory(expense.category);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategoriesData();
  }, [expense]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form inputs
    if (!description || !amount || (!category && !newCategory)) {
      setError('Please fill in all fields.');
      return;
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      setError('Please enter a valid positive amount.');
      return;
    }

    try {
      const expenseCategory = newCategory || category;
      const user = await getCurrentUser();
      if (newCategory) {
        await categoriesCollection.doc(user.uid).collection('categories').doc(newCategory).set({});
      }

      if (expense) {
        // Update existing expense
        const expenseDocRef = doc(db, 'expenses', expense.iid);
        await updateDoc(expenseDocRef, {
          description,
          amount: parseFloat(amount),
          category: expenseCategory,
        });
      } else {
        // Add new expense
        const expenseId = expensesCollection.doc().id;
        await expensesCollection.add({
          id: expenseId,
          userId: user.uid,
          description,
          amount: parseFloat(amount),
          category: expenseCategory,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
      }

      // Reset form fields after successful submission
      setDescription('');
      setAmount('');
      setCategory('');
      setNewCategory('');
      setShowNewCategoryInput(false);
      setError(null);
      onClose();
      // You can optionally display a success message or perform additional actions
    } catch (error) {
      console.error('Error adding/updating expense:', error);
      setError('An error occurred while adding/updating the expense. Please try again.');
    }
  };

  const handleCreateNewCategory = () => {
    setCategory('');
    setNewCategory('');
    setShowNewCategoryInput(true);
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">Add New Expense</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="description" className="block mb-1">
            Description
          </label>
          <input
            type="text"
            id="description"
            placeholder="Enter expense description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="amount" className="block mb-1">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            placeholder="Enter expense amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="block mb-1">
            Category
          </label>
          {!showNewCategoryInput && categories.length > 0 ? (
            <div>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              >
                <option value="">Select a category</option>
                {categories.map((categoryName) => (
                  <option key={categoryName} value={categoryName}>
                    {categoryName}
                  </option>
                ))}
              </select>
              <p className="text-gray-500">
                Can't find your category?{' '}
                <span className="text-blue-500 hover:underline cursor-pointer" onClick={handleCreateNewCategory}>
                  Create a new one
                </span>
              </p>
            </div>
          ) : showNewCategoryInput ? (
            <input
              type="text"
              id="newCategory"
              placeholder="Enter a new category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p>Loading categories...</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 transition-colors duration-300"
        >
          Add Expense
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;
