
import 'package:flutter/material.dart';

class CategoryFilter extends StatelessWidget {
    CategoryFilter({super.key});
  final categories = ["All Explorations", "Safaris", "Beach", "Cultural"];

  @override
  Widget build(BuildContext context) {
    return SizedBox(
    height: 40,
    child: ListView.builder(
      scrollDirection: Axis.horizontal,
      itemCount: categories.length,
      itemBuilder: (context, index) {
        bool isActive = index == 0;
        return Container(
          margin: const EdgeInsets.only(right: 8),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: isActive ? const Color(0xFFF39233) : Colors.white,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: Colors.grey.shade300),
          ),
          child: Text(
            categories[index],
            style: TextStyle(
              color: isActive ? Colors.white : Colors.black54,
              fontWeight: FontWeight.bold,
            ),
          ),
        );
      },
    ),
  );
  }
}