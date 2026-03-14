import 'package:flutter/material.dart';

class SurpriseChip extends StatelessWidget {
  const SurpriseChip({super.key});
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: const Color(0xFFE8781A),
        borderRadius: BorderRadius.circular(20),
      ),
      child: const Text('Surprise Me',
          style: TextStyle(
              color: Colors.white, fontWeight: FontWeight.w700, fontSize: 12)),
    );
  }
}
