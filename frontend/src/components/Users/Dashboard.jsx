import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTransactionsAPI } from "../../services/transactions/transactionService";
import { setTransactions } from "../../redux/slice/transactionSlice";
import TransactionChart from "../Transactions/TransactionChart";
import RevenueChart from "../RevenueCharts";
import TransactionList from "../Transactions/TranactionList";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();
  const transactions = useSelector((state) => state.transactions.items);

  useEffect(() => {
    const load = async () => {
      try {
        console.log("🔄 Dashboard fetching latest transactions...");
        const data = await fetchTransactionsAPI();
        console.log("📊 Dashboard got data:", data);
        dispatch(setTransactions(data));
      } catch (err) {
        console.error("🚨 Error loading dashboard transactions:", err);
      }
    };
    load();
  }, [dispatch]);

  console.log("🧾 Dashboard Redux transactions:", transactions);
  const hasTransactions = transactions && transactions.length > 0;

  return (
    <div className="p-6">
      {hasTransactions ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 items-stretch">
            <div className="flex flex-col h-full"><TransactionChart /></div>
            <div className="flex flex-col h-full"><RevenueChart /></div>
          </div>
          <TransactionList />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-20 px-4">
          <img src="https://i.pinimg.com/736x/e6/30/42/e63042f2ea8303666119c9d8caa97820.jpg" alt="No Transactions" className="w-full max-w-md mb-8 rounded-xl shadow-lg" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No transactions yet</h2>
          <p className="text-gray-600 max-w-md mb-6">Start adding your income and expenses to visualize your financial journey.</p>
          <Link to="/add-transaction">
            <button className="bg-[#00B495] text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-teal-600 transition duration-300">Add Transaction</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
