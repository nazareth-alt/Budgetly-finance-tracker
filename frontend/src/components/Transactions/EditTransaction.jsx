import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  updateTransactionAPI,
  fetchTransactionByIdAPI,
} from "../../services/transactions/transactionService";

const EditTransaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    type: "",
    category: "",
    amount: "",
    date: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactionByIdAPI(id)
      .then((data) => {
        setForm({
          type: data.type,
          category: data.category,
          amount: data.amount,
          date: data.date.slice(0, 10),
          description: data.description,
        });
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        alert(
          err?.response?.data?.message ||
            "Could not load transaction. Please try again."
        );
        navigate("/dashboard");
      });
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateTransactionAPI({ id, ...form });
    navigate("/dashboard");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-6 rounded shadow"
    >
      <h2 className="text-xl font-bold mb-4">Edit Transaction</h2>
      <div className="mb-3">
        <label className="block mb-1">Type</label>
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
        >
          <option value="">Select type</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>
      <div className="mb-3">
        <label className="block mb-1">Category</label>
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
        />
      </div>
      <div className="mb-3">
        <label className="block mb-1">Amount</label>
        <input
          name="amount"
          type="number"
          value={form.amount}
          onChange={handleChange}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
        />
      </div>
      <div className="mb-3">
        <label className="block mb-1">Date</label>
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
        />
      </div>
      <div className="mb-3">
        <label className="block mb-1">Description</label>
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
        />
      </div>
      <button
        type="submit"
        className="bg-[#00B495] text-white px-4 py-2 rounded"
      >
        Update
      </button>
    </form>
  );
};

export default EditTransaction;
