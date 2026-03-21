import 'package:flutter/material.dart';

class CommunityCard extends StatelessWidget {
  const CommunityCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color.fromARGB(255, 236, 235, 235),
        borderRadius: BorderRadius.circular(60),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          // MAIN POST
          const CircleAvatar(
            radius: 35,
            backgroundImage: AssetImage("assets/images/post1.png"),
          ),
          const SizedBox(width: 12),

          // POST DETAILS
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    CircleAvatar(
                        radius: 14,
                        backgroundImage: AssetImage("assets/images/user1.png")),
                    SizedBox(width: 6),
                    Text("Sarah Travels",
                        style: TextStyle(
                            fontWeight: FontWeight.w700, fontSize: 14)),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  "\"The dunes in Namibia are just...\"",
                  style: TextStyle(color: Colors.grey[600], fontSize: 13),
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),

          // INTERACTIONS
          const Column(
            children: [
              Icon(Icons.favorite, color: Color(0xFFE57373), size: 20),
              Text("1.2k",
                  style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
            ],
          ),
          const SizedBox(width: 10),
        ],
      ),
    );
  }
}
