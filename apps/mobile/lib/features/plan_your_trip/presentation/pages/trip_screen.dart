
import 'package:flutter/material.dart';

class TripAppBar extends StatelessWidget {
  final String subtitle;
  final int step;
  final int totalSteps;
  const TripAppBar({
    super.key,
    required this.subtitle,
    required this.step,
    required this.totalSteps,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      child: Column(
        children: [
          Row(
            children: [
              GestureDetector(
                onTap: () => Navigator.maybePop(context),
                child: Container(
                  width: 34,
                  height: 34,
                  decoration: BoxDecoration(
                    color: const Color(0xFFF5F0E8),
                    shape: BoxShape.circle,
                    border: Border.all(color: const Color(0xFFE8D5B0), width: 1),
                  ),
                  child: const Icon(Icons.arrow_back_ios_new,
                      color: Color(0xFF6B5B3E), size: 14),
                ),
              ),
              const Spacer(),
              Column(
                children: [
                  Row(
                    children: [
                      Container(
                        width: 22,
                        height: 22,
                        decoration: const BoxDecoration(
                          color: Color(0xFFE8781A),
                          shape: BoxShape.circle,
                        ),
                        child: const Center(
                            child: Text('🌍', style: TextStyle(fontSize: 11))),
                      ),
                      const SizedBox(width: 5),
                      const Text('Amoni',
                          style: TextStyle(
                              fontWeight: FontWeight.w700,
                              fontSize: 14,
                              color: Color(0xFF3D2B1A))),
                    ],
                  ),
                  Text(subtitle,
                      style: const TextStyle(
                          fontSize: 10,
                          color: Color(0xFF9E8A70),
                          letterSpacing: 0.3)),
                ],
              ),
              const Spacer(),
              const SizedBox(width: 34),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: List.generate(totalSteps, (i) {
              return Expanded(
                child: Container(
                  margin: EdgeInsets.only(right: i < totalSteps - 1 ? 4 : 0),
                  height: 3,
                  decoration: BoxDecoration(
                    color: i < step
                        ? const Color(0xFFE8781A)
                        : const Color(0xFFE8D5B0),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              );
            }),
          ),
        ],
      ),
    );
  }
}


