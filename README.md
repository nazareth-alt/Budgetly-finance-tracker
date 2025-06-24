# 💸 Budgetly – Smart Finance Tracker

**Budgetly** is a modern, full-stack personal finance management application designed to help users take control of their money. Whether you're tracking income, expenses, or savings, Budgetly gives you a clear overview of your finances with helpful charts, smart tips, and motivational alerts.

---

## 🎯 Project Theme: "Track Smarter, Spend Better"

Budgetly was built around the idea that financial control leads to personal freedom. It empowers users to:

- Monitor income and expenses
- Visualize spending patterns
- Receive smart alerts when balance is low
- Adjust financial habits for a more secure future

---

## 🌐 Live Demo

- 🔗 Frontend: [https://your-frontend.vercel.app](https://your-frontend.vercel.app)
- 🔗 Backend: [https://your-backend-api.com](https://your-backend-api.com)

---

## 🚀 Features

### 👥 Authentication
- Secure registration, login, and logout with JWT
- Password reset & change functionality
- Update or delete user profile with confirmation

### 💰 Transactions
- Add income and expenses
- Filter by category, type, or date
- See transaction history and summaries
- Smart alerts for low balances

### 📊 Dashboard
- Income vs. Expense breakdown
- Total balance display
- Random investment tips and motivational messages
- GIFs to encourage or warn based on current finances

### 👤 User Profile
- Avatar upload and preview
- Update username and email
- Delete account (with confirmation)

---

## 🧱 Tech Stack

### 🖥️ Frontend
- **React + Vite**
- **Tailwind CSS** for UI
- **Redux Toolkit** (auth, transactions, wishlist)
- **React Query** for async data fetching
- **React Router DOM** for navigation
- **SweetAlert2** for alerts and confirmations
- **React Icons**, **Swiper**, **Chart.js**

### 🌐 Backend
- **Node.js + Express**
- **MongoDB + Mongoose**
- **JWT Authentication**
- **REST API** with full CRUD
- **Express Async Handler**
- **CORS, dotenv, bcryptjs**

---

🛡️ Security Practices
- Passwords are hashed using bcryptjs
- Auth tokens are verified on every protected route
- CORS properly configured for frontend domain
- User input validated on both frontend and backend

## Testing Tips
- Use Postman to test Authorization: Bearer <token> headers
- Try creating transactions manually using /transactions/create
- Add and remove categories or test filters via query params

📄 License
MIT License © 2025 Nazareth Hlana

