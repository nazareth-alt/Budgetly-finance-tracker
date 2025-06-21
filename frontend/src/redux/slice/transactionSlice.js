import { createSlice } from "@reduxjs/toolkit";

const transactionsSlice = createSlice({
  name: "transactions",
  initialState: {
    items: [],
  },
  reducers: {
    setTransactions: (state, action) => {
      state.items = action.payload;
    },
    addTransaction: (state, action) => {
      state.items.push(action.payload);
    },
    // add more reducers as needed
  },
});

export const { setTransactions, addTransaction } = transactionsSlice.actions;
export default transactionsSlice.reducer;