import React, { useEffect } from 'react';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

const SpendingBreakdown = ({ fetchExpenseData, expenseData, totalExpenses }) => {
  useEffect(() => {
    fetchExpenseData();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Spending Breakdown</h2>
      <div className="flex flex-col md:flex-row items-center">
        <div className="w-full md:w-2/3 mr-4 mb-4">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={expenseData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-full md:w-1/3">
          <h3 className="text-lg font-bold mb-2">Total Expenses</h3>
          <p className="text-2xl font-bold">${typeof totalExpenses === 'number' ? totalExpenses.toFixed(2) : '0.00'}</p>
        </div>
      </div>
    </div>
  );
};

export default SpendingBreakdown;
