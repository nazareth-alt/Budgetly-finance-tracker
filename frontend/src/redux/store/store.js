import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/authSlice";
import transactionsReducer from "../slice/transactionSlice"; // <-- add this

export const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionsReducer, // <-- add this
  },
});