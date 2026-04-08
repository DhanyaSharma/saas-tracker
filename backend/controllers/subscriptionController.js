const Subscription = require("../models/Subscription");

// ➤ Add subscription
exports.addSubscription = async (req, res) => {
  try {
    const newSub = new Subscription(req.body);
    const saved = await newSub.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ➤ Get all subscriptions
exports.getSubscriptions = async (req, res) => {
  try {
    const subs = await Subscription.find();
    res.json(subs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ➤ Delete subscription
exports.deleteSubscription = async (req, res) => {
  try {
    await Subscription.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// ➤ Get total monthly cost
exports.getMonthlyCost = async (req, res) => {
  try {
    const subs = await Subscription.find({ isActive: true });

    let total = 0;

    subs.forEach(sub => {
      if (sub.billingCycle === "yearly") {
        total += sub.cost / 12;
      } else {
        total += sub.cost;
      }
    });

    res.json({ monthlyCost: total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ➤ Get upcoming renewals (next 3 days)
exports.getUpcomingRenewals = async (req, res) => {
  try {
    const subs = await Subscription.find({ isActive: true });

    const today = new Date();

    const upcoming = subs.filter(sub => {
      const renewal = new Date(sub.renewalDate);

      const diffTime = renewal - today;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      return diffDays >= 0 && diffDays <= 3;
    });

    res.json(upcoming);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// ➤ Category-wise monthly spending
exports.getCategoryBreakdown = async (req, res) => {
  try {
    const subs = await Subscription.find({ isActive: true });

    const result = {};

    subs.forEach(sub => {
      let monthlyCost =
        sub.billingCycle === "yearly"
          ? sub.cost / 12
          : sub.cost;

      if (result[sub.category]) {
        result[sub.category] += monthlyCost;
      } else {
        result[sub.category] = monthlyCost;
      }
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};