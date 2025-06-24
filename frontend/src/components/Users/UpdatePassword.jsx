import React, { useState } from "react";
import { AiOutlineLock } from "react-icons/ai";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { changePasswordAPI } from "../../services/users/userService";
import { logoutAction } from "../../redux/slice/authSlice";
import AlertMessage from "../Alert/AlertMessage";

const UpdatePassword = () => {
  const dispatch = useDispatch();

  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { mutateAsync, isPending, isError, error, isSuccess } = useMutation({
    mutationFn: changePasswordAPI,
    mutationKey: ["change-password"],
  });

  const validate = () => {
    if (!password) return "Password is required";
    if (password.length < 5) return "Password must be at least 5 characters long";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    setErrorMsg(validationError);
    if (validationError) return;

    try {
      await mutateAsync(password);
      dispatch(logoutAction());
      localStorage.removeItem("userInfo");
    } catch (e) {
      console.error("Password update failed:", e);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-lg font-semibold mb-4">Change Your Password</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-xs">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="new-password">
            New Password
          </label>

          {isPending && <AlertMessage type="loading" message="Updating..." />}
          {isError && (
            <AlertMessage
              type="error"
              message={error?.response?.data?.message || "Something went wrong"}
            />
          )}
          {isSuccess && (
            <AlertMessage type="success" message="Password updated successfully" />
          )}

          <div className="flex items-center border-2 py-2 px-3 rounded">
            <AiOutlineLock className="text-gray-400 mr-2" />
            <input
              id="new-password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched(true)}
              placeholder="Enter new password"
              className="outline-none flex-1 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {touched && errorMsg && (
            <span className="text-xs text-red-500">{errorMsg}</span>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Update Password
        </button>
      </form>
    </div>
  );
};

export default UpdatePassword;
