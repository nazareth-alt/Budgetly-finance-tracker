import axios from "axios";
import { BASE_URL } from "../utils/url";
import { getUserFromStorage } from "../utils/getUserFromStorage";

const token = () => ({
  headers: { Authorization: `Bearer ${getUserFromStorage()}` },
});

export const getGoalsAPI = async () => {
  const res = await axios.get(`${BASE_URL}/goals`, token());
  return res.data;
};

export const createGoalAPI = async (goalData) => {
  const res = await axios.post(`${BASE_URL}/goals`, goalData, token());
  return res.data;
};

// ✅ Alias createGoalAPI also as addGoalAPI
export const addGoalAPI = createGoalAPI;

export const updateGoalAPI = async ({ id, ...data }) => {
  const res = await axios.put(`${BASE_URL}/goals/${id}`, data, token());
  return res.data;
};

export const deleteGoalAPI = async (id) => {
  const res = await axios.delete(`${BASE_URL}/goals/${id}`, token());
  return res.data;
};

