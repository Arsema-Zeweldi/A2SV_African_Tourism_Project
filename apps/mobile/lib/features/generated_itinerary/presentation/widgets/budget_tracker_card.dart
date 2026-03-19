import 'package:flutter/material.dart';

class BudgetTrackerCard extends StatelessWidget {
  final double totalCost;
  final double budgetLimit;

  const BudgetTrackerCard({
    super.key,
    required this.totalCost,
    required this.budgetLimit,
  });

  @override
  Widget build(BuildContext context) {
    double percent = (totalCost / budgetLimit).clamp(0.0, 1.0);
    double remaining = budgetLimit - totalCost;

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text("TOTAL EST. COST", 
            style: TextStyle(color: Color(0xFFA3AED0), fontSize: 12, fontWeight: FontWeight.bold)),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text("\$${totalCost.toInt()}", 
                style: const TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: Color(0xFFF69435))),
              Text("Budget Limit: \$${budgetLimit.toInt()}", 
                style: const TextStyle(color: Color(0xFF435334), fontWeight: FontWeight.bold, fontSize: 14)),
            ],
          ),
          const SizedBox(height: 12),
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: LinearProgressIndicator(
              value: percent,
              minHeight: 10,
              backgroundColor: Colors.grey.shade100,
              valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFFF69435)),
            ),
          ),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text("${(percent * 100).toInt()}% of budget used", 
                style: TextStyle(color: Colors.grey.shade500, fontSize: 12)),
              Text("\$${remaining.toInt()} left", 
                style: const TextStyle(color: Color(0xFF1B254B), fontWeight: FontWeight.bold, fontSize: 12)),
            ],
          ),
        ],
      ),
    );
  }
}