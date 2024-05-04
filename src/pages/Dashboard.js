import React, { useState, useEffect } from 'react';
import { getCurrentUser, logoutUser, expensesCollection, db } from '../utils/firebase';
import ExpenseForm from '../components/Expenses/ExpenseForm';
import { useNavigate } from 'react-router-dom';
import { doc, deleteDoc, query, getDocs, collection, where } from 'firebase/firestore';
import SpendingBreakdown from '../components/Expenses/SpendingBreakdown';

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [expenseData, setExpenseData] = useState([]);

  const fetchExpenseData = async (user) => {
    if (user) {
      try {
        const expensesSnapshot = await expensesCollection.where('userId', '==', user.uid).get();
        const expensesData = expensesSnapshot.docs.map((doc) => ({
          iid: doc.id,
          ...doc.data(),
        }));

        const total = expensesData.reduce((sum, expense) => sum + expense.amount, 0);
        setTotalExpenses(total);
        setExpenses(expensesData);
      } catch (error) {
        console.error('Error fetching expense data:', error);
      }
    } else {
      // Handle the case when user is null or undefined
      console.log('User not available.');
    }
  };
  const fetchExpenseDataVisual = async () => {
    try {
      const user = await getCurrentUser();
      if (user) {
        const expensesQuery = query(collection(db, 'expenses'), where('userId', '==', user.uid));
        const expensesSnapshot = await getDocs(expensesQuery);
        const expensesData = expensesSnapshot.docs.map((doc) => doc.data());

        const categories = Array.from(new Set(expensesData.map((expense) => expense.category)));
        const expenses = categories.map((category) => ({
          name: category,
          value: expensesData
            .filter((expense) => expense.category === category)
            .reduce((sum, expense) => sum + expense.amount, 0),
        }));

        const totalExpense = expensesData.reduce((sum, expense) => sum + expense.amount, 0);

        setExpenseData(expenses);
        setTotalExpenses(totalExpense);
      }
    } catch (error) {
      console.error('Error fetching expense data:', error);
    }
  };
  const fetchUser = async () => {
    const user = await getCurrentUser();
    setCurrentUser(user);
    fetchExpenseData(user); // Call fetchExpenseData with the fetched user
    fetchExpenseDataVisual();
  };
  useEffect(() => {
    fetchUser();
  }, []);

  const handleOpenModal = (expense = null) => {
    setSelectedExpense(expense);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleExpenseSubmitted = () => {
    fetchUser();
    handleCloseModal();
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      const expenseDocRef = doc(db, 'expenses', expenseId);
      await deleteDoc(expenseDocRef);
      fetchUser();
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-md shadow-md">
        <h1 className="text-3xl font-bold mb-4">Welcome to the Dashboard</h1>
        <button
          className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors duration-300"
          onClick={() => logoutUser().then(() => navigate('/'))}
        >
          Logout
        </button>
        <p className="mb-4">
          You are currently logged in as <span className="font-bold">{currentUser?.email || 'Loading...'}</span>.
        </p>

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Total Expenses</h2>
          <p className="text-2xl font-bold">${typeof totalExpenses === 'number' ? totalExpenses.toFixed(2) : '0.00'}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Expenses by Category</h2>
          {expenses.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr>
                  <th className="py-2 px-4 bg-gray-200 text-left">Date</th>
                  <th className="py-2 px-4 bg-gray-200 text-left">Description</th>
                  <th className="py-2 px-4 bg-gray-200 text-left">Category</th>
                  <th className="py-2 px-4 bg-gray-200 text-right">Amount</th>
                  <th className="py-2 px-4 bg-gray-200 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id} className="border-b border-gray-200">
                    <td className="py-3 px-4 font-medium">
                      {expense.createdAt && expense.createdAt.toDate().toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">{expense.description}</td>
                    <td className="py-3 px-4">{expense.category}</td>
                    <td className="py-3 px-4 text-right font-medium">
                      ${typeof expense.amount === 'number' ? expense.amount.toFixed(2) : '0.00'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        className="bg-blue-500 text-white py-1 px-2 rounded-md hover:bg-blue-600 transition-colors duration-300 mr-2"
                        onClick={() => handleOpenModal(expense)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white py-1 px-2 rounded-md hover:bg-red-600 transition-colors duration-300"
                        onClick={() => handleDeleteExpense(expense.iid)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No expenses found.</p>
          )}
        </div>

        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300"
          onClick={() => handleOpenModal()}
        >
          Add New Expense
        </button>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-gray-800 opacity-75" onClick={handleCloseModal}></div>
            <div className="bg-white p-6 rounded-md shadow-md z-50">
              <ExpenseForm onClose={handleExpenseSubmitted} expense={selectedExpense} />
            </div>
          </div>
        )}
      </div>
      <div className="mb-6">
        <SpendingBreakdown
          fetchExpenseData={fetchExpenseDataVisual}
          expenseData={expenseData}
          totalExpenses={totalExpenses}
        />
      </div>
    </div>
  );
};

export default Dashboard;
