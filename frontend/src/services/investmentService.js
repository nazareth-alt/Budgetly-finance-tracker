import axios from "axios";

export const getInvestmentTipsAPI = async () => {
  const res = await axios.get("http://localhost:8000/api/investment-tips"); // 🔁 Replace with your deployed backend URL in prod
  return res.data;
};
