import 'package:mobile/features/plan_trip/presentation/pages/trip_screen.dart';
import 'package:flutter/material.dart';

import 'package:mobile/core/widgets/malak/trip_bottom_nav.dart';

class PlanTripSummaryScreen extends StatelessWidget {
  const PlanTripSummaryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final items = [
      {'icon': '📍', 'label': 'DESTINATION', 'value': 'Maasai Mara, Kenya'},
      {'icon': '☀', 'label': 'CLIMATE', 'value': 'Warm & Sunny'},
      {'icon': '📅', 'label': 'DURATION', 'value': '10 Days'},
      {'icon': '✨', 'label': 'VIBE', 'value': 'Adventure & Wildlife'},
      {'icon': '💰', 'label': 'BUDGET', 'value': 'Premium (\$\$\$\$)'},
    ];

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            const TripAppBar(
                subtitle: 'Plan Your Trip', step: 4, totalSteps: 4),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Review Your',
                        style: TextStyle(
                            fontSize: 28,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFF1A1008),
                            height: 1.1)),
                    const Text('Dream Escape',
                        style: TextStyle(
                            fontSize: 28,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFFE8781A),
                            fontStyle: FontStyle.italic,
                            height: 1.1)),
                    const SizedBox(height: 6),
                    const Text(
                        "We've captured your preferences. Does everything look perfect?",
                        style: TextStyle(fontSize: 12, color: Color(0xFF9E8A70))),
                    const SizedBox(height: 20),
                    ...items.map((item) => Container(
                      margin: const EdgeInsets.only(bottom: 10),
                      padding: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 14),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFAF7F2),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: const Color(0xFFE8D5B0)),
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 38,
                            height: 38,
                            decoration: BoxDecoration(
                              color: const Color(0xFFFFF0E0),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Center(
                                child: Text(item['icon']!,
                                    style: const TextStyle(fontSize: 18))),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(item['label']!,
                                    style: const TextStyle(
                                        fontSize: 9,
                                        letterSpacing: 1.2,
                                        color: Color(0xFF9E8A70),
                                        fontWeight: FontWeight.w700)),
                                const SizedBox(height: 2),
                                Text(item['value']!,
                                    style: const TextStyle(
                                        fontSize: 14,
                                        fontWeight: FontWeight.w700,
                                        color: Color(0xFF3D2B1A))),
                              ],
                            ),
                          ),
                          GestureDetector(
                            onTap: () => Navigator.pop(context),
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: const Color(0xFFF5F0E8),
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(
                                    color: const Color(0xFFE8D5B0)),
                              ),
                              child: const Text('Edit',
                                  style: TextStyle(
                                      fontSize: 11,
                                      color: Color(0xFF9E8A70),
                                      fontWeight: FontWeight.w600)),
                            ),
                          ),
                        ],
                      ),
                    )),
                    const SizedBox(height: 16),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(16),
                      child: Container(
                        height: 120,
                        decoration: const BoxDecoration(
                          gradient: LinearGradient(
                            colors: [Color(0xFFD4A853), Color(0xFF8B6914)],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                        ),
                        child: Stack(
                          children: [
                            const Center(
                                child: Text('🌅',
                                    style: TextStyle(fontSize: 60))),
                            Container(
                              decoration: BoxDecoration(
                                gradient: LinearGradient(
                                  begin: Alignment.topCenter,
                                  end: Alignment.bottomCenter,
                                  colors: [
                                    Colors.transparent,
                                    Colors.black.withOpacity(0.3),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      "Disclaimer: We've made some general assumptions to craft this summary. Our experts will confirm all details with you shortly.",
                      style: TextStyle(
                          fontSize: 10,
                          color: Color(0xFF9E8A70),
                          height: 1.4),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 20),
                    GestureDetector(
                      onTap: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: const Row(
                              children: [
                                Text('🌍 ', style: TextStyle(fontSize: 16)),
                                Text('Crafting your dream itinerary...',
                                    style: TextStyle(
                                        color: Colors.white,
                                        fontWeight: FontWeight.w600)),
                              ],
                            ),
                            backgroundColor: const Color(0xFFE8781A),
                            behavior: SnackBarBehavior.floating,
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12)),
                          ),
                        );
                      },
                      child: Container(
                        width: double.infinity,
                        height: 54,
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [Color(0xFF3D2B1A), Color(0xFF6B4423)],
                          ),
                          borderRadius: BorderRadius.circular(14),
                          boxShadow: [
                            BoxShadow(
                              color: const Color(0xFF3D2B1A).withOpacity(0.4),
                              blurRadius: 16,
                              offset: const Offset(0, 6),
                            ),
                          ],
                        ),
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text('✨ ', style: TextStyle(fontSize: 16)),
                            Text('GENERATE MY ITINERARY',
                                style: TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.w800,
                                    fontSize: 13,
                                    letterSpacing: 0.8)),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ),
            const TripBottomNav(),
          ],
        ),
      ),
    );
  }
}
