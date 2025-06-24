import { Fragment } from "react";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { IoLogOutOutline } from "react-icons/io5";
import { SiAuthy } from "react-icons/si";
import { logoutAction } from "../../redux/slice/authSlice";
import { MdOutlineSavings, MdSpaceDashboard } from "react-icons/md";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { FaPlusCircle, FaUserCircle } from "react-icons/fa";
import { BiCategoryAlt } from "react-icons/bi";
import { useTheme } from "../../context/ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function PrivateNavbar() {
  const dispatch = useDispatch();
  const logoutHandler = () => {
    dispatch(logoutAction());
    localStorage.removeItem("userInfo");
  };

  const navLinkClass = ({ isActive }) =>
    `inline-flex items-center px-2 pt-1 text-sm font-medium border-b-2 transition-colors duration-200 ${
      isActive
        ? "text-[#00B495] border-[#00B495]"
        : "text-gray-500 border-transparent hover:text-[#00B495] hover:border-[#00B495]"
    }`;
  const { theme, toggleTheme } = useTheme();

  return (
    <Disclosure as="nav" className="bg-white dark:bg-gray-800 dark:text-white">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-start items-center">
              <div className="flex justify-between flex-row w-full">
                <div className="-ml-2 mr-2 flex items-left md:hidden">
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex flex-shrink-0 items-center">
                  <SiAuthy className="h-8 w-auto text-green-500" />
                </div>
                <div className="hidden md:ml-6 md:flex md:space-x-8 items-center">
                  <NavLink to="/" className={navLinkClass}>
                    BudgetlyTracker
                  </NavLink>
                  <NavLink to="/smart-spend" className={navLinkClass}>
                    <MdOutlineSavings className="mr-1 text-lg" /> Smart Spend
                  </NavLink>
                  <NavLink to="/add-transaction" className={navLinkClass}>
                    <RiMoneyDollarCircleLine className="mr-1 text-lg" /> Add
                    Transaction
                  </NavLink>
                  <NavLink to="/add-category" className={navLinkClass}>
                    <FaPlusCircle className="mr-1 text-lg" /> Add Category
                  </NavLink>
                  <NavLink to="/categories" className={navLinkClass}>
                    <BiCategoryAlt className="mr-1 text-lg" /> Categories
                  </NavLink>
                  <NavLink to="/dashboard" className={navLinkClass}>
                    <MdSpaceDashboard className="mr-1 text-lg" /> Dashboard
                  </NavLink>
                  <NavLink to="/profile" className={navLinkClass}>
                    <FaUserCircle className="mr-1 text-lg" /> Profile
                  </NavLink>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleTheme}
                    className="text-yellow-500 hover:text-yellow-600"
                  >
                    {theme === "dark" ? <FaSun /> : <FaMoon />}
                  </button>
                  <button
                    onClick={logoutHandler}
                    className="bg-red-600 text-white p-2 rounded-full flex items-center justify-center"
                    title="Logout"
                  >
                    <IoLogOutOutline className="text-lg" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Mobile menu */}
          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              <NavLink to="/" className={navLinkClass}>
                BudgetlyTracker
              </NavLink>
              <NavLink to="/dashboard" className={navLinkClass}>
                <MdSpaceDashboard className="mr-1 text-lg" /> Dashboard
              </NavLink>
              <NavLink to="/add-transaction" className={navLinkClass}>
                <RiMoneyDollarCircleLine className="mr-1 text-lg" /> Add
                Transaction
              </NavLink>
              <NavLink to="/add-category" className={navLinkClass}>
                <FaPlusCircle className="mr-1 text-lg" /> Add Category
              </NavLink>
              <NavLink to="/categories" className={navLinkClass}>
                <BiCategoryAlt className="mr-1 text-lg" /> Categories
              </NavLink>
              <NavLink to="/smart-spend" className={navLinkClass}>
                <MdOutlineSavings className="mr-1 text-lg" /> Smart Spend
              </NavLink>
              <NavLink to="/profile" className={navLinkClass}>
                <FaUserCircle className="mr-1 text-lg" /> Profile
              </NavLink>
              {/* Theme toggle button for mobile */}
              <button
                onClick={toggleTheme}
                className="w-full flex items-center gap-x-2 mt-2 text-yellow-500 hover:text-yellow-600 px-3 py-2 rounded-md"
                type="button"
              >
                {theme === "dark" ? <FaSun /> : <FaMoon />}
                <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
              </button>
              {/* Logout button styled as before */}
              <button
                onClick={logoutHandler}
                className="bg-red-600 text-white px-3 py-2 rounded-md w-full mt-2"
              >
                <IoLogOutOutline className="inline-block mr-1" />
                Logout
              </button>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
