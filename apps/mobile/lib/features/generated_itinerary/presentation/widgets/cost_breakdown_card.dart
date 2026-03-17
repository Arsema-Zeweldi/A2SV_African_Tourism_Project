import 'package:flutter/material.dart';

class CostBreakdownCard extends StatelessWidget {
  const CostBreakdownCard({super.key});

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
          _buildRow("Accommodation", "\$0 (Prepaid)"),
          _buildRow("Transportation", "\$85"),
          _buildRow("Activities", "\$190"),
          _buildRow("Food & Beverage", "\$45"),
        ],
      ),
    );
  }

  Widget _buildRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: Color(0xFF1B254B))),
          Text(value, style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF1B254B))),
        ],
      ),
    );
  }
}