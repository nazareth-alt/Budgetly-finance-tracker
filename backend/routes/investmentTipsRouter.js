const express = require("express");
const router = express.Router();

// GET /api/investment-tips
router.get("/api/investment-tips", (req, res) => {
  res.json([
    "Open a Tax-Free Savings Account (TFSA).",
    "Invest monthly in index funds or ETFs.",
    "Track subscriptions and cancel unused ones.",
    "Diversify your portfolio (stocks, crypto, property).",
    "Review your spending every week.",
    "Automate savings to avoid overspending.",
  ]);
});

module.exports = router;