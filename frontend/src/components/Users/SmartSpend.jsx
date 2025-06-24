import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { getInvestmentTipsAPI } from "../../services/investmentService";
import { FaArrowTrendUp } from "react-icons/fa6";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useDispatch } from "react-redux";
import { fetchTransactionsAPI } from "../../services/transactions/transactionService";
import { setTransactions } from "../../redux/slice/transactionSlice";

const SmartSpend = () => {
  const dispatch = useDispatch();
  const transactions = useSelector((state) => state.transactions.items);

  useEffect(() => {
    const load = async () => {
      try {
        console.log("📡 SmartSpend fetching fresh transactions...");
        const data = await fetchTransactionsAPI();
        console.log("💹 SmartSpend got data:", data);
        dispatch(setTransactions(data));
      } catch (err) {
        console.error("❌ SmartSpend fetch failed:", err);
      }
    };
    load();
  }, [dispatch]);

  console.log("📈 SmartSpend Redux transactions:", transactions);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const { data: investmentTips = [] } = useQuery({
    queryKey: ["investment-tips"],
    queryFn: getInvestmentTipsAPI,
  });

  const testimonials = [
    {
      name: "Lebo M.",
      text: "Budgeting helped me buy my first car in 8 months!",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
      gif: "https://media.giphy.com/media/3o7TKsQ8UU9HjRZRxK/giphy.gif",
    },
    {
      name: "Thabo N.",
      text: "I saved R10,000 by tracking my food delivery habits.",
      image: "https://randomuser.me/api/portraits/men/44.jpg",
      gif: "https://media.giphy.com/media/xUPGcguWZHRC2HyBRS/giphy.gif",
    },
    {
      name: "Zanele K.",
      text: "Using SmartSpend, I was able to invest in property.",
      image: "https://randomuser.me/api/portraits/women/85.jpg",
      gif: "https://media.giphy.com/media/xUOxf48HDG0JJzQf5e/giphy.gif",
    },
  ];

  const randomTestimonial =
    testimonials[Math.floor(Math.random() * testimonials.length)];

  // --- Financial Growth Chart Data ---
  // 1. Get unique months from transaction dates
  const monthSet = new Set();
  transactions.forEach((t) => {
    const date = new Date(t.date);
    const month = date.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    monthSet.add(month);
  });
  const months = Array.from(monthSet).sort((a, b) => {
    const [aMonth, aYear] = a.split(" ");
    const [bMonth, bYear] = b.split(" ");
    const aDate = new Date(`${aMonth} 1, ${aYear}`);
    const bDate = new Date(`${bMonth} 1, ${bYear}`);
    return aDate - bDate;
  });

  // 2. Initialize monthlyData with zeros
  const monthlyData = {};
  months.forEach((month) => {
    monthlyData[month] = { month, income: 0, expense: 0, balance: 0 };
  });

  // 3. Fill in actual transaction data
  transactions.forEach((t) => {
    const date = new Date(t.date);
    const month = date.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    if (monthlyData[month]) {
      if (t.type === "income") {
        monthlyData[month].income += t.amount;
      } else if (t.type === "expense") {
        monthlyData[month].expense += t.amount;
      }
    }
  });

  // 4. Calculate cumulative balance for each month
  let runningBalance = 0;
  const financeData = months.map((month) => {
    runningBalance += monthlyData[month].income - monthlyData[month].expense;
    return {
      month,
      balance: runningBalance,
      income: monthlyData[month].income,
      expense: monthlyData[month].expense,
    };
  });

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <h1 className="text-3xl font-bold text-[#00B495] mb-2">
        Welcome Back 👋
      </h1>
      <p className="text-gray-700 mb-6">
        Here's your current financial snapshot and tips to grow your wealth.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Financial Summary */}
        <div className="bg-gray-50 p-4 rounded shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            💰 Financial Summary
          </h2>
          <p className="text-gray-600 mb-2">
            Total Income:{" "}
            <span className="text-green-600">R{totalIncome.toFixed(2)}</span>
          </p>
          <p className="text-gray-600 mb-2">
            Total Expense:{" "}
            <span className="text-red-500">R{totalExpense.toFixed(2)}</span>
          </p>
          <p className="text-gray-800 font-semibold">
            Current Balance: R{balance.toFixed(2)}
          </p>

          {balance < 1000 && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">
              ⚠️ Warning: Your balance is below R1000. Reduce spending!
            </div>
          )}
        </div>

        {/* Investment Tips */}
        <div className="bg-blue-50 p-4 rounded shadow">
          <h2 className="text-lg font-semibold text-blue-700 mb-3 flex items-center gap-2">
            <FaArrowTrendUp className="text-blue-500" /> Investment Tips
          </h2>
          <ul className="list-disc list-inside text-sm text-gray-700">
            {investmentTips.length > 0 ? (
              investmentTips.map((tip, i) => <li key={i}>{tip}</li>)
            ) : (
              <li>No tips available right now. Check back later.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Financial Growth Chart */}
      <div className="bg-gray-50 p-4 rounded-lg shadow mb-10 mt-10">
        <h2 className="text-lg font-semibold mb-3 text-gray-800">
          Financial Growth Overview
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={financeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#00B495"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Testimonial Section */}
      <div className="mt-10 bg-gray-100 p-6 rounded-lg shadow flex flex-col md:flex-row items-center gap-6">
        <img
          src={randomTestimonial.image}
          alt={randomTestimonial.name}
          className="w-20 h-20 rounded-full border-4 border-white shadow"
        />
        <div className="flex-1 text-center md:text-left">
          <p className="text-gray-800 italic mb-1">
            “{randomTestimonial.text}”
          </p>
          <p className="text-sm font-semibold text-[#00B495]">
            – {randomTestimonial.name}
          </p>
        </div>
        <img
          src={randomTestimonial.gif}
          alt="Success"
          className="w-32 rounded-lg shadow"
        />
      </div>
    </div>
  );
};

export default SmartSpend;
