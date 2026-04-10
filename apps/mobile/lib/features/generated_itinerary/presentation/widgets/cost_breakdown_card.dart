import 'package:flutter/material.dart';

class CostBreakdownCard extends StatelessWidget {
  final double accommodationCost;
  final double transportCost;
  final double activitiesCost;
  final double foodCost;
  final double? otherCost;

  const CostBreakdownCard({
    super.key,
    required this.accommodationCost,
    required this.transportCost,
    required this.activitiesCost,
    required this.foodCost,
    this.otherCost,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color.fromARGB(255, 224, 224, 224).withOpacity(0.8),
        borderRadius: BorderRadius.circular(24),
      ),
      child: Column(
        children: [
          const Row(
            children: [
              Icon(Icons.analytics_outlined, size: 18, color: Color(0xFF435334)),
              SizedBox(width: 8),
              Text("COST BREAKDOWN", style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF435334))),
            ],
          ),
          const SizedBox(height: 16),
          _buildRow("Accommodation", "\$${accommodationCost.toStringAsFixed(2)}"),
          _buildRow("Transportation", "\$${transportCost.toStringAsFixed(2)}"),
          _buildRow("Activities", "\$${activitiesCost.toStringAsFixed(2)}"),
          _buildRow("Food & Beverage", "\$${foodCost.toStringAsFixed(2)}"),
          if (otherCost != null) _buildRow("Other", "\$${otherCost!.toStringAsFixed(2)}"),
          const Divider(height: 24),
          _buildRow("Total", "\$${(accommodationCost + transportCost + activitiesCost + foodCost + (otherCost ?? 0)).toStringAsFixed(2)}",
              isTotal: true),
        ],
      ),
    );
  }

  Widget _buildRow(String label, String value, {bool isTotal = false}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label,
              style: TextStyle(
                  color: const Color(0xFF1B254B),
                  fontWeight: isTotal ? FontWeight.bold : FontWeight.normal)),
          Text(value,
              style: TextStyle(
                  fontWeight: isTotal ? FontWeight.bold : FontWeight.w600,
                  color: const Color(0xFF1B254B))),
        ],
      ),
    );
  }
}