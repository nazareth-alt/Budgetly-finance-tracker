import { Fragment, useEffect } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
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

  return (
    <Disclosure as="nav" className="bg-white">
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
                  <NavLink to="/" className={navLinkClass}>BudgetlyTracker</NavLink>
                  <NavLink to="/dashboard" className={navLinkClass}><MdSpaceDashboard className="mr-1 text-lg" /> Dashboard</NavLink>
                  <NavLink to="/add-transaction" className={navLinkClass}><RiMoneyDollarCircleLine className="mr-1 text-lg" /> Add Transaction</NavLink>
                  <NavLink to="/add-category" className={navLinkClass}><FaPlusCircle className="mr-1 text-lg" /> Add Category</NavLink>
                  <NavLink to="/categories" className={navLinkClass}><BiCategoryAlt className="mr-1 text-lg" /> Categories</NavLink>
                  <NavLink to="/smart-spend" className={navLinkClass}><MdOutlineSavings className="mr-1 text-lg" /> Smart Spend</NavLink>
                  <NavLink to="/profile" className={navLinkClass}><FaUserCircle className="mr-1 text-lg" /> Profile</NavLink>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <button
                      onClick={logoutHandler}
                      type="button"
                      className="relative m-2 inline-flex items-center gap-x-1.5 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                    >
                      <IoLogOutOutline className="h-5 w-5" aria-hidden="true" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
}

