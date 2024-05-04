import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';

const ExpenseChart = () => {
  const [expenseData, setExpenseData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    // Fetch expense data from the server
    fetch('/api/expenses')
      .then((response) => response.json())
      .then((data) => {
        const labels = Array.from(new Set(data.map((expense) => expense.category)));
        const datasets = {
          labels,
          datasets: [
            {
              data: labels.map((label) => data.filter((expense) => expense.category === label).length),
              backgroundColor: labels.map(() => `#${Math.floor(Math.random() * 16777215).toString(16)}`),
              borderColor: labels.map(() => `#${Math.floor(Math.random() * 16777215).toString(16)}`),
              borderWidth: 1,
            },
          ],
        };
        setExpenseData(datasets);
      })
      .catch((error) => console.error('Error fetching expense data:', error));
  }, []);

  return <Pie data={expenseData} />;
};

export default ExpenseChart;
