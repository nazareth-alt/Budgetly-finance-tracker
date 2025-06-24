import React, { useState } from "react";
import {
  FaWallet,
} from "react-icons/fa";
import { SiDatabricks } from "react-icons/si";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { addCategoryAPI } from "../../services/category/categoryService";
import AlertMessage from "../Alert/AlertMessage";

const AddCategory = () => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({ type: "", name: "" });
  const [errors, setErrors] = useState({});

  const { mutateAsync, isPending, isError, error, isSuccess } = useMutation({
    mutationFn: addCategoryAPI,
    mutationKey: ["add-category"],
  });

  // Simple validation
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Category name is required";
    if (!formData.type) newErrors.type = "Category type is required";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // clear error on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      await mutateAsync(formData);
      navigate("/categories");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto my-10 bg-white p-6 rounded-lg shadow-lg space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800">Add New Category</h2>
        <p className="text-gray-600">Fill in the details below.</p>
      </div>

      {isError && (
        <AlertMessage
          type="error"
          message={
            error?.response?.data?.message ||
            "Something went wrong. Try again later."
          }
        />
      )}
      {isSuccess && (
        <AlertMessage
          type="success"
          message="Category added successfully, redirecting..."
        />
      )}

      {/* Category Type */}
      <div className="space-y-2">
        <label className="flex gap-2 items-center text-gray-700 font-medium">
          <FaWallet className="text-blue-500" />
          <span>Type</span>
        </label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring dark:bg-gray-800 dark:text-white"
        >
          <option value="">Select transaction type</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
      </div>

      {/* Category Name */}
      <div className="space-y-2">
        <label className="text-gray-700 font-medium">
          <SiDatabricks className="inline mr-2 text-blue-500" />
          Name
        </label>
        <input
          type="text"
          name="name"
          placeholder="Category name"
          value={formData.name}
          onChange={handleChange}
          className="w-full mt-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:border-blue-500 focus:ring dark:bg-gray-800 dark:text-white"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
        disabled={isPending}
      >
        {isPending ? "Adding..." : "Add Category"}
      </button>
    </form>
  );
};

export default AddCategory;
