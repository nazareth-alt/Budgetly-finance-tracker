import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  FaDollarSign,
  FaCalendarAlt,
  FaRegCommentDots,
  FaWallet,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { listCategoriesAPI } from "../../services/category/categoryService";
import { addTransactionAPI } from "../../services/transactions/transactionService";
import AlertMessage from "../Alert/AlertMessage";
import { addTransaction } from "../../redux/slice/transactionSlice";
import Swal from "sweetalert2";
import { fetchTransactionsAPI } from "../../services/transactions/transactionService";
import { setTransactions } from "../../redux/slice/transactionSlice";

const TransactionForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    type: "",
    amount: "",
    category: "",
    date: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const {
    mutateAsync,
    isPending,
    isError: isAddTranErr,
    error: transErr,
    isSuccess,
  } = useMutation({
    mutationFn: addTransactionAPI,
    mutationKey: ["add-transaction"],
  });

  const {
    data: categories,
    isError,
    isLoading,
    error,
  } = useQuery({
    queryFn: listCategoriesAPI,
    queryKey: ["list-categories"],
  });

  const validate = () => {
    const newErrors = {};
    if (!formData.type) newErrors.type = "Transaction type is required";
    if (!formData.amount || formData.amount <= 0)
      newErrors.amount = "Amount must be a positive number";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.date) newErrors.date = "Date is required";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      const result = await mutateAsync(formData);
      dispatch(addTransaction(result));
      // Refetch all transactions and update Redux
      const allTransactions = await fetchTransactionsAPI();
      dispatch(setTransactions(allTransactions));

      // ✅ Show confirmation alert
      Swal.fire({
        title: "Success!",
        text: "Transaction added successfully. Go to dashboard?",
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#00B495",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, go!",
      }).then((res) => {
        if (res.isConfirmed) {
          navigate("/dashboard");
        }
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto my-10 bg-white p-6 rounded-lg shadow-lg space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          Transaction Details
        </h2>
        <p className="text-gray-600">Fill in the details below.</p>
      </div>

      {isError && (
        <AlertMessage
          type="error"
          message={error?.response?.data?.message || "Something went wrong"}
        />
      )}
      {isSuccess && (
        <AlertMessage type="success" message="Transaction added successfully" />
      )}

      {/* Type */}
      <div>
        <label className="flex items-center gap-2 text-gray-700 font-medium">
          <FaWallet className="text-blue-500" />
          Type
        </label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full border mt-1 rounded-md p-2 dark:bg-gray-800 dark:text-white"
        >
          <option value="">Select transaction type</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        {touched.type && errors.type && (
          <p className="text-red-500 text-xs">{errors.type}</p>
        )}
      </div>

      {/* Amount */}
      <div>
        <label className="text-gray-700 font-medium">
          <FaDollarSign className="inline mr-2 text-blue-500" />
          Amount
        </label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full mt-1 border rounded-md p-2 dark:bg-gray-800 dark:text-white"
        />
        {touched.amount && errors.amount && (
          <p className="text-red-500 text-xs">{errors.amount}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <label className="text-gray-700 font-medium">
          <FaRegCommentDots className="inline mr-2 text-blue-500" />
          Category
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full mt-1 border rounded-md p-2 dark:bg-gray-800 dark:text-white"
        >
          <option value="">Select a category</option>
          {categories?.map((c) => (
            <option key={c._id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
        {touched.category && errors.category && (
          <p className="text-red-500 text-xs">{errors.category}</p>
        )}
      </div>

      {/* Date */}
      <div>
        <label className="text-gray-700 font-medium">
          <FaCalendarAlt className="inline mr-2 text-blue-500" />
          Date
        </label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full mt-1 border rounded-md p-2 dark:bg-gray-800 dark:text-white"
        />
        {touched.date && errors.date && (
          <p className="text-red-500 text-xs">{errors.date}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="text-gray-700 font-medium">
          <FaRegCommentDots className="inline mr-2 text-blue-500" />
          Description (Optional)
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="w-full mt-1 border rounded-md p-2 dark:bg-gray-800 dark:text-white"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition"
      >
        Submit Transaction
      </button>
    </form>
  );
};

export default TransactionForm;
