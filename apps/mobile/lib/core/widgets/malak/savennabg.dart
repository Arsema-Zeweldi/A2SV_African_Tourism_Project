import 'package:flutter/material.dart';

class SavannaBg extends StatelessWidget {
  final Widget child;
  const SavannaBg({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Stack(
      fit: StackFit.expand,
      children: [
        // Warm savanna gradient background
        Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                Color(0xFF8B6914),
                Color(0xFFC4892A),
                Color(0xFFD4A853),
                Color(0xFF8B7355),
                Color(0xFF5C4A2A),
              ],
              stops: [0.0, 0.25, 0.5, 0.75, 1.0],
            ),
          ),
        ),
        // Silhouette tree overlay effect
        Positioned(
          bottom: 0,
          left: 0,
          right: 0,
          height: 200,
          child: Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Colors.transparent,
                  const Color(0xFF2C1A0A).withOpacity(0.7),
                ],
              ),
            ),
          ),
        ),
        // Sun glow effect
        Positioned(
          top: 60,
          right: 30,
          child: Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: const Color(0xFFFFD700).withOpacity(0.3),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFFFFD700).withOpacity(0.4),
                  blurRadius: 40,
                  spreadRadius: 20,
                ),
              ],
            ),
          ),
        ),
        child,
      ],
    );
  }
}
