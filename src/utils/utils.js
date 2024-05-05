import { CSVLink } from 'react-csv';

export const ExportExpensesAsCSV = ({ expenses }) => {
  const headers = [
    { label: 'Date', key: 'date' },
    { label: 'Description', key: 'description' },
    { label: 'Category', key: 'category' },
    { label: 'Amount', key: 'amount' },
  ];

  const data = expenses.map((expense) => ({
    date: expense.createdAt.toDate().toLocaleDateString(),
    description: expense.description,
    category: expense.category,
    amount: expense.amount,
  }));

  return (
    <CSVLink data={data} headers={headers} filename="expenses.csv">
      Export Expenses (CSV)
    </CSVLink>
  );
};
