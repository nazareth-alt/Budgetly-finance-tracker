import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { registerAPI } from "../../services/users/userService";
import AlertMessage from "../Alert/AlertMessage";

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const { mutateAsync, isPending, isError, error, isSuccess } = useMutation({
    mutationFn: registerAPI,
    mutationKey: ["register"],
  });

  const validate = () => {
    const errs = {};
    if (!formData.username.trim()) errs.username = "Username is required";
    if (!formData.email) {
      errs.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = "Invalid email address";
    }
    if (!formData.password) {
      errs.password = "Password is required";
    } else if (formData.password.length < 6) {
      errs.password = "Password must be at least 6 characters long";
    }
    if (!formData.confirmPassword) {
      errs.confirmPassword = "Confirming your password is required";
    } else if (formData.confirmPassword !== formData.password) {
      errs.confirmPassword = "Passwords must match";
    }
    return errs;
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
      await mutateAsync(formData);
    } catch (e) {
      console.error("Registration failed:", e);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto my-10 bg-white p-6 rounded-xl shadow-lg space-y-6 border border-gray-200"
    >
      <h2 className="text-3xl font-semibold text-center text-gray-800">
        Sign Up
      </h2>

      {isPending && <AlertMessage type="loading" message="Loading..." />}
      {isError && (
        <AlertMessage
          type="error"
          message={
            error?.response?.data?.message || error?.message || "An error occurred"
          }
        />
      )}
      {isSuccess && <AlertMessage type="success" message="Registration success" />}

      <p className="text-sm text-center text-gray-500">
        Join our community now!
      </p>

      {/* Username */}
      <div className="relative dark:bg-gray-800 dark:text-white">
        <FaUser className="absolute top-3 left-3 text-gray-400" />
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Username"
          className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
        />
        {touched.username && errors.username && (
          <span className="text-xs text-red-500">{errors.username}</span>
        )}
      </div>

      {/* Email */}
      <div className="relative dark:bg-gray-800 dark:text-white">
        <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Email"
          className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
        />
        {touched.email && errors.email && (
          <span className="text-xs text-red-500">{errors.email}</span>
        )}
      </div>

      {/* Password */}
      <div className="relative dark:bg-gray-800 dark:text-white">
        <FaLock className="absolute top-3 left-3 text-gray-400" />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Password"
          className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
        />
        {touched.password && errors.password && (
          <span className="text-xs text-red-500">{errors.password}</span>
        )}
      </div>

      {/* Confirm Password */}
      <div className="relative dark:bg-gray-800 dark:text-white">
        <FaLock className="absolute top-3 left-3 text-gray-400" />
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Confirm Password"
          className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
        />
        {touched.confirmPassword && errors.confirmPassword && (
          <span className="text-xs text-red-500">{errors.confirmPassword}</span>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-bold py-2 px-4 rounded-md transition duration-150"
      >
        Register
      </button>
    </form>
  );
};

export default RegistrationForm;
