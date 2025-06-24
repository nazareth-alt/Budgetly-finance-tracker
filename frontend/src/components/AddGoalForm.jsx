import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createGoalAPI } from "../services/goalsServices";
import Swal from "sweetalert2";

const AddGoalForm = ({ onGoalAdded }) => {
  const [form, setForm] = useState({
    title: "",
    targetAmount: "",
    currentAmount: "",
    deadline: "",
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createGoalAPI,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "targetAmount" || name === "currentAmount"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, targetAmount } = form;
    if (!title || !targetAmount) {
      return Swal.fire(
        "Error",
        "Title and target amount are required.",
        "error"
      );
    }
    try {
      await mutateAsync(form);
      Swal.fire("Success", "Goal added successfully!", "success");
      setForm({
        title: "",
        targetAmount: "",
        currentAmount: "",
        deadline: "",
      });
      if (onGoalAdded) onGoalAdded(); // optional callback to refetch goals
    } catch (err) {
      Swal.fire(
        "Error",
        err?.response?.data?.message || "Failed to add goal",
        "error"
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-10 bg-white p-6 rounded shadow max-w-xl mx-auto"
    >
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        🎯 Add a New Goal
      </h3>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Title
        </label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g., Buy a laptop"
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#00B495]"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Target Amount (R)
        </label>
        <input
          type="number"
          name="targetAmount"
          value={form.targetAmount}
          onChange={handleChange}
          placeholder="e.g., 100000"
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#00B495]"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Current Amount (R)
        </label>
        <input
          type="number"
          name="currentAmount"
          value={form.currentAmount}
          onChange={handleChange}
          placeholder="e.g., 5000"
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#00B495]"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Deadline
        </label>
        <input
          type="date"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#00B495]"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="bg-[#00B495] text-white px-4 py-2 rounded hover:bg-teal-600 disabled:opacity-60"
      >
        {isPending ? "Saving..." : "Add Goal"}
      </button>
    </form>
  );
};

export default AddGoalForm;
