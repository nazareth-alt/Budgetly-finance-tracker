// components/RevenueChart.jsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useSelector } from "react-redux";

// Custom tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
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

  // 1. Extract & sort months
  const monthSet = new Set();
  transactions.forEach((t) => {
    const date = new Date(t.date);
    const month = date.toLocaleString("default", { month: "short", year: "numeric" });
    monthSet.add(month);
  });

  const months = Array.from(monthSet).sort((a, b) => {
    const aDate = new Date(a);
    const bDate = new Date(b);
    return aDate - bDate;
  });

  // 2. Init data
  const monthlyData = {};
  months.forEach((month) => {
    monthlyData[month] = { month, income: 0, expense: 0, count: 0 };
  });

  // 3. Fill actual data
  transactions.forEach((t) => {
    const date = new Date(t.date);
    const month = date.toLocaleString("default", { month: "short", year: "numeric" });
    if (monthlyData[month]) {
      if (t.type === "income") {
        monthlyData[month].income += t.amount;
      } else if (t.type === "expense") {
        monthlyData[month].expense += t.amount;
      }
      monthlyData[month].count += 1;
    }
  });

  const chartData = Object.values(monthlyData);

  return (
    <div className="bg-white p-4 rounded-lg shadow h-full w-full flex flex-col justify-between">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">
        Monthly Revenue
      </h2>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="income" fill="#00B495" name="Income" />
            <Bar dataKey="expense" fill="#FF5A5F" name="Expense" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;

