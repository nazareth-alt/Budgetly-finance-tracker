import axios from "axios";
import { BASE_URL } from "../../utils/url";
import { getUserFromStorage } from "../../utils/getUserFromStorage";

//! Add Transaction
export const addTransactionAPI = async ({
  type,
  category,
  date,
  description,
  amount,
}) => {
  const token = getUserFromStorage();
  const response = await axios.post(
    `${BASE_URL}/transactions/create`,
    {
      category,
      date,
      description,
      amount,
      type,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

//! Fetch all transactions (for dashboard, etc)
export const fetchTransactionsAPI = async () => {
  const token = getUserFromStorage();
  const response = await axios.get(`${BASE_URL}/transactions/lists`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

//! Fetch single transaction by ID
export const fetchTransactionByIdAPI = async (id) => {
  const token = getUserFromStorage();
  const res = await axios.get(`${BASE_URL}/transactions/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

//! Update transaction
export const updateTransactionAPI = async ({ id, ...data }) => {
  const token = getUserFromStorage();
  const res = await axios.put(`${BASE_URL}/transactions/update/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

//! Delete transaction
export const deleteTransactionAPI = async (id) => {
  const token = getUserFromStorage();
  const response = await axios.delete(`${BASE_URL}/transactions/delete/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

//! Update category
export const updateCategoryAPI = async ({ name, type, id }) => {
  const token = getUserFromStorage();
  const response = await axios.put(
    `${BASE_URL}/categories/update/${id}`,
    {
      name,
      type,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

//! Delete category
export const deleteCategoryAPI = async (id) => {
  const token = getUserFromStorage();
  const response = await axios.delete(`${BASE_URL}/categories/delete/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

//! List transactions with filters
export const listTransactionsAPI = async ({
  category,
  type,
  startDate,
  endDate,
}) => {
  const token = getUserFromStorage();
  const response = await axios.get(`${BASE_URL}/transactions/lists`, {
    params: { category, endDate, startDate, type },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};