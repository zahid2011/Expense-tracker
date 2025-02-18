# BudgetHub - Personal Expense Tracker

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://budgethub.vercel.app)
![Vercel](https://img.shields.io/badge/frontend-vercel-000000?logo=vercel) 
![Render](https://img.shields.io/badge/backend-render-46e3b7?logo=render) 
![PostgreSQL](https://img.shields.io/badge/database-postgresql-4169E1?logo=postgresql)


BudgetHub is a full-stack personal expense tracker that helps you manage budgets, track expenses and income, and analyze your spending patterns—all from a modern, responsive interface. Whether you register for a full account or try out the app in guest mode (with temporary data that’s automatically removed), BudgetHub makes managing your money easy and efficient.

---

## 🚀 Deployment

The application is fully deployed and accessible online:  
- **Frontend:** [https://budgethub.vercel.app](https://budgethub.vercel.app)  
- **Backend:** Hosted on Render  
- **Database:** PostgreSQL on Render

---

## 🎥 Demo Video

For a comprehensive walkthrough of BudgetHub's features, watch the full demo video hosted on Google Drive:  
[View Full Demo Video](https://drive.google.com/file/d/1zgaX0Cg1rDipRw5yQbmVFKl8zEXKJZFt/view?usp=sharing)

**Screenshots:**

- **Dashboard Overview:** A snapshot of the main dashboard with summary cards and interactive charts.
- **Budget Management:** The budget page displaying budgets, expense tracking, and progress indicators.

![Dashboard Overview](https://github.com/user-attachments/assets/d12df355-271d-4d20-b76c-d534a6ac2b7b)  
![Budget Management](https://github.com/user-attachments/assets/d81b76a5-23be-4bea-9b6c-ab00a14046e8)

---

## ⚙️ Overview

BudgetHub simplifies your financial management by allowing you to:

- **Manage Budgets:** Create, edit, and delete budgets with customizable icons.
- **Track Expenses:** Log expenses with detailed descriptions, amounts, dates, and categories.
- **Record Income:** Manage and track multiple income sources.
- **Visualize Data:** Access interactive charts and graphs that provide an at-a-glance financial summary.
- **Guest Mode:** Try out the app without registering—guest data is temporary and automatically removed upon logout.

---

## 🛠️ Key Features & Technical Highlights

### 🔒 Secure Authentication & Authorization
- **JWT Authentication:** Uses token-based sessions with JWT for secure user sessions.
- **Protected Routes:** Middleware ensures only authenticated users can access sensitive data.

### 📊 Data Visualization & Insights
- **Interactive Charts:** Integrated with Chart.js to display monthly cash flow and spending distribution.
- **Real-time Updates:** React state management provides instant feedback on financial data.

### 👥 Guest Mode Implementation
- **Temporary Accounts:** Auto-generated guest accounts let users try the app without full registration.
- **Auto-Deletion:** Guest data is automatically removed upon logout, ensuring privacy and efficient database usage.

### 💾 Database & Performance
- **Prisma ORM:** Type-safe queries and migrations for data handling.
- **PostgreSQL:** A reliable relational database hosted on Render for persistent storage.

---

## 🧰 Tech Stack

### Frontend
- **React.js** – Component-based, dynamic user interface.
- **React Router** – Seamless navigation between views.
- **Chart.js** – Interactive charts for data visualization.
- **CSS Modules** – Scoped, modular styling.
- **Vite** – Modern, fast development build tool.

### Backend
- **Node.js & Express.js** – Scalable server-side runtime and API routing.
- **Prisma ORM** – Type-safe database interactions.
- **PostgreSQL** – Structured data storage.
- **JWT & bcrypt** – Secure authentication and password hashing.

---

## 📁 Project Structure

### Frontend
- **Components 🎨:** Reusable UI elements such as forms, charts, and cards.
- **Pages 🖥️:** Main views including Dashboard, Budgets, Expenses, Income, and Settings.
- **Routing 🔐:** Protected routes for authenticated users.
- **State Management 📦:** Global state management (e.g., via Context API) for user authentication.

### Backend
- **RESTful API 🔄:** CRUD endpoints for budgets, expenses, and incomes.
- **Middleware 🛡️:** Authentication, error handling, and CORS configuration.
- **Database Models 🗃️:** Prisma schema defining models for users, budgets, expenses, and incomes.

---

## 📌 How It Works

1. **User Registration & Login:**  
   Users can sign up for a full account or log in as a guest.  
   Guest accounts are temporary and are deleted from the database upon logout.

2. **Budget & Expense Management:**  
   Users can create budgets, add expenses, and track income.  
   The dashboard provides an overview of financial health through interactive charts and summary cards.

3. **Data Visualization:**  
   The application aggregates data on the backend and renders it in intuitive charts on the frontend.

4. **Secure & Responsive:**  
   All sensitive routes are protected via JWT, and the interface is optimized for both desktop and mobile devices.

---

## 🔗 Links

- **Live Demo:** [https://budgethub.vercel.app](https://budgethub.vercel.app)
- **GitHub Repository:** [https://github.com/zahid2011/Expense-tracker.git](https://github.com/zahid2011/Expense-tracker.git)




