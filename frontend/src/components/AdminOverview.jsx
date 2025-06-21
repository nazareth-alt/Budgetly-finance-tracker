// components/AdminOverview.jsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useSelector } from "react-redux";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const total = (data.income || 0) + (data.expense || 0);

    return (
      <div className="bg-white p-3 border border-gray-300 rounded shadow-md text-sm">
        <p className="font-semibold text-gray-700">{label}</p>
        <p className="text-green-600">Income: R{data.income?.toFixed(2)}</p>
        <p className="text-red-500">Expense: R{data.expense?.toFixed(2)}</p>
        <p className="text-gray-600">Transactions: {data.count || 0}</p>
      </div>
    );
  }
  return null;
};

const RevenueChart = () => {
  const transactions = useSelector((state) => state.transactions.items);

  const monthlyData = {};

  transactions.forEach((t) => {
    const date = new Date(t.date);
    const month = date.toLocaleString("default", { month: "short", year: "numeric" });

    if (!monthlyData[month]) {
      monthlyData[month] = { month, income: 0, expense: 0, count: 0 };
    }

    if (t.type === "income") {
      monthlyData[month].income += t.amount;
    } else if (t.type === "expense") {
      monthlyData[month].expense += t.amount;
    }

    monthlyData[month].count += 1;
  });

  const chartData = Object.values(monthlyData);

  // Optional debug
  console.log("📊 Chart Data:", chartData);

  return (
    <div className="w-full max-w-xl mx-auto bg-white p-4 rounded-lg shadow mb-6">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">Monthly Revenue</h2>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="income" stroke="#00B495" name="Income" />
          <Line type="monotone" dataKey="expense" stroke="#FF5A5F" name="Expense" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;

