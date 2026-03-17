import 'package:flutter/material.dart';

class SummaryCard extends StatelessWidget {
  final String trips;
  final String posts;

  const SummaryCard({super.key, required this.trips, required this.posts});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(50),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          _buildStatColumn("TRIPS", trips),
          Container(height: 30, width: 1, color: Colors.grey[200]),
          _buildStatColumn("POSTS", posts),
        ],
      ),
    );
  }

  Widget _buildStatColumn(String label, String count) {
    return Column(
      children: [
        Text(count,
            style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
        Text(label,
            style: const TextStyle(
                color: Colors.grey, fontSize: 12, letterSpacing: 1.1)),
      ],
    );
  }
}
