import React, { useState, useEffect } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { ArrowUp, ArrowDown, DollarSign, Wallet } from "lucide-react";
import "./Dashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    budgetUtilization: { used: 0, total: 0 },
  });

  const [barChartData, setBarChartData] = useState({ labels: [], datasets: [] });
  const [pieChartData, setPieChartData] = useState({ labels: [], datasets: [] });
  const [transactions, setTransactions] = useState([]);

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Monthly Cash Flow" },
      tooltip: { callbacks: { label: (context) => ` $${context.parsed.y.toFixed(2)}` } }
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "right" },
      title: { display: true, text: "Spending Categories" },
      tooltip: {
        callbacks: {
          label: (context) => {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            return `${context.label}: $${context.parsed} (${((context.parsed / total) * 100).toFixed(1)}%)`;
          }
        }
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        
        const [
          summaryRes, 
          barRes, 
          pieRes,
          expensesRes,
          incomesRes
        ] = await Promise.all([
          fetch(`http://localhost:5000/summary/${user.id}`),
          fetch(`http://localhost:5000/chart-data/${user.id}`),
          fetch(`http://localhost:5000/pie-chart-data/${user.id}`),
          fetch(`http://localhost:5000/expenses/${user.id}`),
          fetch(`http://localhost:5000/incomes/${user.id}`)
        ]);

        // Process summary data
        const summaryData = await summaryRes.json();
        setSummary(summaryData);

        // Process bar chart data
        const barData = await barRes.json();
        setBarChartData({
          labels: barData.labels,
          datasets: [
            {
              label: "Income",
              data: barData.income,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
            {
              label: "Expenses",
              data: barData.expenses,
              backgroundColor: "rgba(255, 99, 132, 0.6)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
            },
          ]
        });

        // Process pie chart data
        const pieData = await pieRes.json();
        setPieChartData({
          labels: pieData.categories,
          datasets: [{
            data: pieData.amounts,
            backgroundColor: [
              "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0",
              "#9966FF", "#FF9F40", "#E7E9ED", "#8B5CF6"
            ],
            hoverOffset: 4,
          }]
        });

        // Process transactions
        const expenses = await expensesRes.json();
        const incomes = await incomesRes.json();
        const allTransactions = [
          ...expenses.map(e => ({ ...e, type: 'expense' })),
          ...incomes.map(i => ({ ...i, type: 'income' }))
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
         .slice(0, 6);

        setTransactions(allTransactions);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Financial Dashboard</h1>
      <p className="dashboard-subtitle">
        Comprehensive overview of your financial health - Track income, expenses, 
        and budgets in one place
      </p>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card">
          <h3>Total Income</h3>
          <p className="amount">${summary.totalIncome.toLocaleString()}</p>
          <p className="change">
            <ArrowUp size={16} /> Monthly Trend
          </p>
        </div>
        <div className="card">
          <h3>Total Expenses</h3>
          <p className="amount">${summary.totalExpenses.toLocaleString()}</p>
          <p className="change">
            <ArrowDown size={16} /> Monthly Trend
          </p>
        </div>
        <div className="card">
          <h3>Net Balance</h3>
          <p className="amount">${summary.balance.toLocaleString()}</p>
          <p className="change">
            {summary.balance >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
            Current Month
          </p>
        </div>
        <div className="card">
          <h3>Budget Used</h3>
          <p className="amount">
            {((summary.budgetUtilization.used / summary.budgetUtilization.total) * 100).toFixed(1)}%
          </p>
          <p className="change">
            ${summary.budgetUtilization.used.toFixed(0)} / ${summary.budgetUtilization.total.toFixed(0)}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-card">
          <h2>Income vs Expenses</h2>
          <div className="chart-container">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
          <div className="chart-explanation">
            <h4>Cash Flow Analysis</h4>
            <p>
              Track monthly income (teal) and expenses (red). Healthy financial management 
              shows consistent income exceeding expenses. Hover for exact values.
            </p>
          </div>
        </div>

        <div className="chart-card">
          <h2>Expense Breakdown</h2>
          <div className="chart-container">
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
          <div className="chart-explanation">
            <h4>Spending Distribution</h4>
            <p>
              Visualizes spending categories. Click legend items to toggle categories. 
              Aim for balanced distribution across essential needs.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="transactions-card">
        <h2>Recent Transactions</h2>
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>
                    {new Date(transaction.date).toLocaleString('en-US', {
                      timeZone: 'UTC',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                </td>
                <td>{transaction.description || transaction.source}</td>
                <td>{transaction.category}</td>
                <td className={transaction.type === 'income' ? 'positive' : 'negative'}>
                  {transaction.type === 'income' ? '+' : '-'}
                  ${Math.abs(transaction.amount).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick Actions */}
      <div className="navigation-buttons">
        <div className="nav-card">
          <DollarSign size={24} />
          <p>Income Page</p>
        </div>
        <div className="nav-card">
          <ArrowDown size={24} />
          <p>Expense Page</p>
        </div>
        <div className="nav-card">
            <Wallet size={24} /> 
            <p>All Transactions</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;