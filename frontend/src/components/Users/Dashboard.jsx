import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import TransactionChart from "../Transactions/TransactionChart";
import TransactionList from "../Transactions/TranactionList";
import AdminOverview from "../../components/AdminOverview";
import { setTransactions } from "../../redux/slice/transactionSlice";
import { fetchTransactionsAPI } from "../../services/transactions/transactionService";
import RevenueChart from "../RevenueCharts";

const Dashboard = () => {
  const dispatch = useDispatch();
  const transactions = useSelector((state) => state.transactions.items);
  const hasTransactions = transactions && transactions.length > 0;

  // Fetch transactions from backend on mount
  useEffect(() => {
    fetchTransactionsAPI().then((data) => {
      dispatch(setTransactions(data));
    });
  }, [dispatch]);

  return (
    <div className="p-6">
      {hasTransactions ? (
        <>
          <TransactionChart />
          <TransactionList />
          <RevenueChart />
          <AdminOverview />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-20 px-4">
          <img
            src="https://i.pinimg.com/736x/e6/30/42/e63042f2ea8303666119c9d8caa97820.jpg"
            alt="No Transactions"
            className="w-full max-w-md mb-8 rounded-xl shadow-lg animate-fadeIn"
          />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No transactions yet
          </h2>
          <p className="text-gray-600 max-w-md mb-6">
            Start adding your income and expenses to visualize your financial
            journey.
          </p>
          <Link to="/add-transaction">
            <button className="bg-[#00B495] text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-teal-600 transition duration-300">
              Add Transaction
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;


