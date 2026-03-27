import 'package:flutter/material.dart';

class AdventureGlobe extends StatelessWidget {
  const AdventureGlobe({super.key});
  @override
  Widget build(BuildContext context) {
    return Container(
      width: 50,
      height: 50,
      decoration: BoxDecoration(
        color: const Color(0xFFE8781A).withOpacity(0.2),
        shape: BoxShape.circle,
      ),
      child: const Center(child: Text('🧭', style: TextStyle(fontSize: 24))),
    );
  }
}
