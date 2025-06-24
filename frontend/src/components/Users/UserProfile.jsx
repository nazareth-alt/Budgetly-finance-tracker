import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import {
  updateProfileAPI,
  deleteProfileAPI,
} from "../../services/users/userService";
import Swal from "sweetalert2";
import UpdatePassword from "./UpdatePassword";

const UserProfile = () => {
  const storedUser = JSON.parse(localStorage.getItem("userInfo") || "{}");

  const [email, setEmail] = useState(storedUser.email || "");
  const [username, setUsername] = useState(storedUser.username || "");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarBase64, setAvatarBase64] = useState(null);

  const { mutateAsync } = useMutation({
    mutationFn: updateProfileAPI,
    mutationKey: ["update-profile"],
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProfileAPI,
    mutationKey: ["delete-profile"],
    onSuccess: () => {
      Swal.fire("Deleted", "Your account has been deleted", "success");
      localStorage.clear();
      window.location.href = "/";
    },
    onError: () => {
      Swal.fire("Error", "Could not delete account", "error");
    },
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setAvatarBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { username, email, avatar: avatarBase64 };
    try {
      await mutateAsync(payload);
      Swal.fire("Success", "Profile updated successfully!", "success");
    } catch (e) {
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto my-10 p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-extrabold text-center mb-6">
          Update your Profile
        </h1>

        {/* Avatar and Info */}
        <div className="flex flex-col items-center mb-6">
          <label className="cursor-pointer relative group">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar"
                className="w-24 h-24 object-cover rounded-full ring-2 ring-[#00B495]"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-5xl text-gray-400">
                <FaUserCircle />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="absolute inset-0 opacity-0 dark:bg-gray-800 dark:text-white"
            />
          </label>

          <div className="text-center mt-3">
            <p className="font-semibold text-gray-800">{storedUser.username}</p>
            <p className="text-sm text-gray-500">{storedUser.email}</p>
          </div>
        </div>

        {/* Form to edit username/email */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-[#00B495] focus:border-[#00B495] dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-[#00B495] focus:border-[#00B495] dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#00B495] hover:bg-teal-700 text-white font-semibold py-2 px-6 rounded"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Change Password + Delete Account side by side */}
      <div className="max-w-4xl mx-auto mt-10 grid md:grid-cols-2 gap-6">
        <div className="p-6 bg-white border rounded-lg shadow-sm">
          <h2 className="text-lg font-bold text-gray-700 mb-4">Change Password</h2>
          <UpdatePassword />
        </div>

        <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-center">
          <h2 className="text-lg font-bold text-red-700 mb-2">Danger Zone</h2>
          <p className="mb-4 text-sm text-red-600">
            Deleting your account is permanent and cannot be undone.
          </p>
          <button
            onClick={() => {
              Swal.fire({
                title: "Are you sure?",
                text: "This will permanently delete your account.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#e3342f",
                cancelButtonColor: "#6c757d",
                confirmButtonText: "Yes, delete it",
              }).then((result) => {
                if (result.isConfirmed) {
                  deleteMutation.mutate();
                }
              });
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded"
          >
            Delete My Account
          </button>
        </div>
      </div>
    </>
  );
};

export default UserProfile;

