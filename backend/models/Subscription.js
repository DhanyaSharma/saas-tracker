const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  cost:        { type: Number, required: true },
  billingCycle:{ type: String, enum: ["monthly", "yearly"], required: true },
  category:    { type: String },
  startDate:   { type: Date, required: true },
  renewalDate: { type: Date, required: true },
  autoRenew:   { type: Boolean, default: false },
  isActive:    { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("Subscription", subscriptionSchema);