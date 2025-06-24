import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FaTrash, FaEdit } from "react-icons/fa";

import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { listTransactionsAPI } from "../../services/transactions/transactionService";
import { listCategoriesAPI } from "../../services/category/categoryService";
import { deleteTransactionAPI } from "../../services/transactions/transactionService";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";

const TransactionList = () => {
  const navigate = useNavigate();

  const handleUpdateTransaction = (id) => {
    navigate(`/edit-transaction/${id}`);
  };
  //!Filtering state
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    type: "",
    category: "",
  });
  //!Handle Filter Change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  //fetching
  const {
    data: categoriesData,
    isLoading: categoryLoading,
    error: categoryErr,
  } = useQuery({
    queryFn: listCategoriesAPI,
    queryKey: ["list-categories"],
  });
  //fetching
  const {
    data: transactions,
    isError,
    isLoading,
    isFetched,
    error,
    refetch,
  } = useQuery({
    queryFn: () => listTransactionsAPI(filters),
    queryKey: ["list-transactions", filters],
  });
  // Delete mutation
  const { mutate: deleteTransaction } = useMutation({
    mutationFn: deleteTransactionAPI,
    onSuccess: () => {
      refetch(); // Refetch transactions after delete
    },
  });

  // Handle delete
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      deleteTransaction(id);
    }
  };
  const exportToExcel = () => {
    if (!transactions || transactions.length === 0) return;

    const data = transactions.map((t) => ({
      Date: new Date(t.date).toLocaleDateString(),
      Type: t.type,
      Category: t.category?.name || "Uncategorized",
      Amount: t.amount,
      Description: t.description || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "transactions.xlsx");
  };

  const exportToWord = async () => {
    if (!transactions || transactions.length === 0) return;

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "Transaction List",
                  bold: true,
                  size: 28,
                }),
              ],
            }),
            ...transactions.map(
              (t) =>
                new Paragraph({
                  children: [
                    new TextRun(
                      `Date: ${new Date(t.date).toLocaleDateString()} | `
                    ),
                    new TextRun(`Type: ${t.type} | `),
                    new TextRun(
                      `Category: ${t.category?.name || "Uncategorized"} | `
                    ),
                    new TextRun(`Amount: R${t.amount} | `),
                    new TextRun(`Description: ${t.description || "N/A"}`),
                  ],
                })
            ),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "transactions.docx");
  };

  return (
    <div className="my-4 p-4 shadow-lg rounded-lg bg-white">
      <div className="flex justify-end mb-4 gap-4">
        <button
          onClick={exportToExcel}
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg shadow"
        >
          📊 Export to Excel
        </button>
        <button
          onClick={exportToWord}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow"
        >
          📄 Export to Word
        </button>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Start Date */}
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
          className="p-2 rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-gray-800 dark:text-white"
        />
        {/* End Date */}
        <input
          value={filters.endDate}
          onChange={handleFilterChange}
          type="date"
          name="endDate"
          className="p-2 rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-gray-800 dark:text-white"
        />
        {/* Type */}
        <div className="relative">
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="w-full p-2 rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 appearance-none"
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <ChevronDownIcon className="w-5 h-5 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
        {/* Category */}
        <div className="relative">
          <select
            value={filters.category}
            onChange={handleFilterChange}
            name="category"
            className="w-full p-2 rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 appearance-none"
          >
            <option value="All">All Categories</option>
            <option value="Uncategorized">Uncategorized</option>
            {categoriesData?.map((category) => {
              return (
                <option key={category?._id} value={category?.name}>
                  {category?.name}
                </option>
              );
            })}
          </select>
          <ChevronDownIcon className="w-5 h-5 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>
      <div className="my-4 p-4 shadow-lg rounded-lg bg-white">
        {/* Inputs and selects for filtering (unchanged) */}
        <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-inner dark:bg-gray-800 dark:text-white">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Filtered Transactions
          </h3>
          <ul className="list-disc pl-5 space-y-2">
            {transactions?.map((transaction) => (
              <li
                key={transaction._id}
                className="bg-white p-3 rounded-md shadow border border-gray-200 flex justify-between items-center"
              >
                <div>
                  <span className="font-medium text-gray-600">
                    {new Date(transaction.date).toLocaleDateString()}
                  </span>
                  <span
                    className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      transaction.type === "income"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {transaction.type.charAt(0).toUpperCase() +
                      transaction.type.slice(1)}
                  </span>
                  <span className="ml-2 text-gray-800">
                    {transaction.category?.name} - $
                    {transaction.amount.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-600 italic ml-2">
                    {transaction.description}
                  </span>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleUpdateTransaction(transaction._id)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(transaction._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;
