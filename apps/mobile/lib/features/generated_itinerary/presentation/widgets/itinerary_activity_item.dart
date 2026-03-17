import 'package:flutter/material.dart';

class ItineraryActivityItem extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final double price;
  final Color iconBgColor;

  const ItineraryActivityItem({
    super.key,
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.price,
    required this.iconBgColor,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12, right: 12, left: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(50),
      ),
      child: Row(
        children: [
          CircleAvatar(
            backgroundColor: iconBgColor.withOpacity(0.1),
            child: Icon(icon, color: iconBgColor, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                Text(subtitle, style: TextStyle(color: Colors.grey.shade500, fontSize: 11)),
              ],
            ),
          ),
          Text("\$${price.toInt()}", 
            style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFFF69435))),
        ],
      ),
    );
  }
}