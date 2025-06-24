import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import React, { useEffect } from "react";
import { fetchTransactionsAPI } from "./services/transactions/transactionService";
import { setTransactions } from "./redux/slice/transactionSlice";
import HeroSection from "./components/Home/HomePage";
import PublicNavbar from "./components/Navbar/PublicNavbar";
import PrivateNavbar from "./components/Navbar/PrivateNavbar";
import LoginForm from "./components/Users/Login";
import RegistrationForm from "./components/Users/Register";
import Dashboard from "./components/Users/Dashboard";
import SmartSpend from "./components/Users/SmartSpend";
import AddCategory from "./components/Category/AddCategory";
import CategoriesList from "./components/Category/CategoriesList";
import UpdateCategory from "./components/Category/UpdateCategory";
import TransactionForm from "./components/Transactions/TransactionForm";
import EditTransaction from "./components/Transactions/EditTransaction";
import UserProfile from "./components/Users/UserProfile";
import AuthRoute from "./components/Auth/AuthRoute";

function App() {
  const user = useSelector((state) => state?.auth?.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        console.log("📦 Fetching transactions on App load...");
        const data = await fetchTransactionsAPI();
        console.log("✅ Transactions fetched:", data);
        dispatch(setTransactions(data));
      } catch (error) {
        console.error("❌ Failed to fetch transactions:", error);
      }
    };

    loadTransactions();
  }, [dispatch]);

  return (
    <div className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white min-h-screen">
      <BrowserRouter>
        {user ? <PrivateNavbar /> : <PublicNavbar />}
        <Routes>
          <Route path="/" element={<HeroSection />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/add-category" element={<AuthRoute><AddCategory /></AuthRoute>} />
          <Route path="/categories" element={<AuthRoute><CategoriesList /></AuthRoute>} />
          <Route path="/update-category/:id" element={<AuthRoute><UpdateCategory /></AuthRoute>} />
          <Route path="/add-transaction" element={<AuthRoute><TransactionForm /></AuthRoute>} />
          <Route path="/edit-transaction/:id" element={<AuthRoute><EditTransaction /></AuthRoute>} />
          <Route path="/dashboard" element={<AuthRoute><Dashboard /></AuthRoute>} />
          <Route path="/smart-spend" element={<AuthRoute><SmartSpend /></AuthRoute>} />
          <Route path="/profile" element={<AuthRoute><UserProfile /></AuthRoute>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
