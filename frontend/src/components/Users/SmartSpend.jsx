import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTransactionsAPI } from "../../services/transactions/transactionService";
import {
  getGoalsAPI,
  deleteGoalAPI,
  updateGoalAPI,
} from "../../services/goalsServices";
import { setTransactions } from "../../redux/slice/transactionSlice";
import AddGoalForm from "../AddGoalForm";
import Swal from "sweetalert2";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const SmartSpend = () => {
  const dispatch = useDispatch();
  const transactions = useSelector((state) => state.transactions.items);
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const txData = await fetchTransactionsAPI();
        dispatch(setTransactions(txData));
        await loadGoals();
      } catch (err) {
        console.error("Error loading transactions or goals:", err);
      }
    };
    loadData();
  }, [dispatch]);

  const loadGoals = async () => {
    try {
      const goalsData = await getGoalsAPI();
      setGoals(goalsData);
    } catch (err) {
      console.error("Error loading goals:", err);
    }
  };

  const handleDeleteGoal = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete Goal?",
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });
    if (confirm.isConfirmed) {
      await deleteGoalAPI(id);
      await loadGoals();
      Swal.fire("Deleted!", "Goal has been removed.", "success");
    }
  };

  const handleEditGoal = async (goal) => {
    const { value: amount } = await Swal.fire({
      title: `Update Current Amount for \"${goal.title}\"`,
      input: "number",
      inputLabel: "Current Amount (R)",
      inputValue: goal.currentAmount,
      showCancelButton: true,
    });
    if (amount !== undefined) {
      await updateGoalAPI({ id: goal._id, currentAmount: Number(amount) });
      await loadGoals();
      Swal.fire("Updated!", "Goal progress updated.", "success");
    }
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const monthSet = new Set();
  transactions.forEach((t) => {
    const date = new Date(t.date);
    const month = date.toLocaleString("default", { month: "short", year: "numeric" });
    monthSet.add(month);
  });
  const months = Array.from(monthSet).sort((a, b) => new Date(a) - new Date(b));
  const monthlyData = {};
  months.forEach((m) => (monthlyData[m] = { month: m, income: 0, expense: 0 }));
  transactions.forEach((t) => {
    const date = new Date(t.date);
    const month = date.toLocaleString("default", { month: "short", year: "numeric" });
    if (monthlyData[month]) {
      if (t.type === "income") monthlyData[month].income += t.amount;
      if (t.type === "expense") monthlyData[month].expense += t.amount;
    }
  });
  let runningBalance = 0;
  const financeData = months.map((month) => {
    runningBalance += monthlyData[month].income - monthlyData[month].expense;
    return {
      ...monthlyData[month],
      balance: runningBalance,
    };
  });

  const investmentTips = [
    "Start investing early to benefit from compound interest.",
    "Diversify your portfolio across different asset classes.",
    "Set clear financial goals before choosing investment options.",
    "Invest consistently, even if the amount is small.",
    "Don’t invest in something you don’t understand.",
    "Use tax-free savings accounts for long-term investments.",
    "Review your investments annually to stay on track.",
    "Keep an emergency fund before investing aggressively.",
    "Avoid emotional decision-making during market swings.",
    "Reinvest dividends to maximize returns over time.",
  ];

  const testimonial = {
    name: "Thabo N.",
    text: "SmartSpend helped me save faster!",
    image: "https://randomuser.me/api/portraits/men/44.jpg",
    gif: "https://media.giphy.com/media/xUPGcguWZHRC2HyBRS/giphy.gif",
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <h1 className="text-3xl font-bold text-[#00B495] mb-4">SmartSpend Dashboard</h1>

      {/* Summary */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded shadow">
          <h2 className="font-semibold text-gray-800 mb-2">💰 Financial Summary</h2>
          <p>Income: <span className="text-green-600">R{totalIncome.toFixed(2)}</span></p>
          <p>Expenses: <span className="text-red-500">R{totalExpense.toFixed(2)}</span></p>
          <p className="font-bold">Balance: R{balance.toFixed(2)}</p>
          {balance < 1000 && (
            <p className="text-red-600 mt-2">
              ⚠️ Warning: Your balance is below R1000. Consider cutting down expenses.
            </p>
          )}
        </div>

        <div className="bg-blue-50 p-4 rounded shadow">
          <h2 className="font-semibold text-blue-700 mb-2">📈 Goals</h2>
          {goals.length ? (
            <ul className="space-y-3">
              {goals.map((goal) => {
                const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
                return (
                  <li key={goal._id} className="bg-white p-3 rounded shadow">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{goal.title}</span>
                      <div className="flex gap-2">
                        <button
                          className="text-xs text-blue-600 hover:underline"
                          onClick={() => handleEditGoal(goal)}
                        >Edit</button>
                        <button
                          className="text-xs text-red-500 hover:underline"
                          onClick={() => handleDeleteGoal(goal._id)}
                        >Delete</button>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 h-2 mt-2 rounded">
                      <div
                        className="bg-[#00B495] h-2 rounded"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      R{goal.currentAmount} of R{goal.targetAmount} ({progress.toFixed(0)}%)
                    </p>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>No goals yet</p>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="my-10">
        <h2 className="font-semibold text-gray-800 mb-3">📊 Monthly Balance</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={financeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="balance" stroke="#00B495" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Add Goal */}
      <AddGoalForm onGoalAdded={loadGoals} />

      {/* Investment Tips */}
      <div className="mt-10 bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold text-[#00B495] mb-3">💡 Investment Tips</h2>
        <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
          {investmentTips.map((tip, i) => <li key={i}>{tip}</li>)}
        </ul>
      </div>

      {/* Testimonial */}
      <div className="mt-10 bg-gray-100 p-6 rounded-lg shadow flex flex-col md:flex-row items-center gap-6">
        <img src={testimonial.image} alt={testimonial.name} className="w-20 h-20 rounded-full border-4 border-white shadow" />
        <div className="flex-1 text-center md:text-left">
          <p className="text-gray-800 italic mb-1">“{testimonial.text}”</p>
          <p className="text-sm font-semibold text-[#00B495]">– {testimonial.name}</p>
        </div>
        <img src={testimonial.gif} alt="Success" className="w-32 rounded-lg shadow" />
      </div>
    </div>
  );
};

export default SmartSpend;

