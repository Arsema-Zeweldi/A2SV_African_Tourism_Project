import 'package:mobile/features/plan_trip/presentation/pages/plan_your_trip_4.dart';
import 'package:mobile/features/plan_trip/presentation/pages/trip_screen.dart';
import 'package:flutter/material.dart';

import 'package:mobile/core/widgets/malak/orange_button.dart';
import 'package:mobile/core/widgets/malak/trip_bottom_nav.dart';
class PlanTripStep3Screen extends StatefulWidget {
  const PlanTripStep3Screen({super.key});

  @override
  State<PlanTripStep3Screen> createState() => _PlanTripStep3ScreenState();
}

class _PlanTripStep3ScreenState extends State<PlanTripStep3Screen> {
  int _days = 10;
  bool _flexibleDates = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
             TripAppBar(subtitle: 'Plan Your Trip', step: 3, totalSteps: 4),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('How long is your\njourney?',
                        style: TextStyle(
                            fontSize: 26,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFF1A1008),
                            height: 1.2)),
                    const SizedBox(height: 6),
                    const Text(
                        "Select the number of days you'd like to explore Africa.",
                        style: TextStyle(fontSize: 12, color: Color(0xFF9E8A70))),
                    const SizedBox(height: 40),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        _counterBtn(Icons.remove, () {
                          if (_days > 1) setState(() => _days--);
                        }),
                        const SizedBox(width: 28),
                        Column(
                          children: [
                            Text('$_days',
                                style: const TextStyle(
                                    fontSize: 56,
                                    fontWeight: FontWeight.w900,
                                    color: Color(0xFF1A1008),
                                    height: 1)),
                            const Text('DAYS',
                                style: TextStyle(
                                    fontSize: 11,
                                    letterSpacing: 2,
                                    color: Color(0xFF9E8A70),
                                    fontWeight: FontWeight.w600)),
                          ],
                        ),
                        const SizedBox(width: 28),
                        _counterBtn(Icons.add, () => setState(() => _days++)),
                      ],
                    ),
                    const SizedBox(height: 20),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [3, 7, 14, 21, 30].map((d) {
                        final sel = _days == d;
                        return GestureDetector(
                          onTap: () => setState(() => _days = d),
                          child: Container(
                            margin: const EdgeInsets.symmetric(horizontal: 4),
                            padding: const EdgeInsets.symmetric(
                                horizontal: 12, vertical: 6),
                            decoration: BoxDecoration(
                              color: sel
                                  ? const Color(0xFFE8781A)
                                  : const Color(0xFFF5F0E8),
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(
                                  color: sel
                                      ? const Color(0xFFE8781A)
                                      : const Color(0xFFE8D5B0)),
                            ),
                            child: Text('${d}d',
                                style: TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w600,
                                    color: sel
                                        ? Colors.white
                                        : const Color(0xFF6B5B3E))),
                          ),
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 28),
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 14, vertical: 12),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFFF8F0),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: const Color(0xFFE8D5B0)),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.calendar_month_outlined,
                              color: Color(0xFFE8781A), size: 18),
                          const SizedBox(width: 10),
                          const Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('Flexible dates',
                                    style: TextStyle(
                                        fontWeight: FontWeight.w700,
                                        fontSize: 13,
                                        color: Color(0xFF3D2B1A))),
                                Text("I'm open to adjustments ± 3 days",
                                    style: TextStyle(
                                        fontSize: 11, color: Color(0xFF9E8A70))),
                              ],
                            ),
                          ),
                          Switch(
                            value: _flexibleDates,
                            onChanged: (v) =>
                                setState(() => _flexibleDates = v),
                            activeColor: const Color(0xFFE8781A),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF5F0E8),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: const Color(0xFFE8D5B0)),
                      ),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            width: 28,
                            height: 28,
                            decoration: const BoxDecoration(
                              color: Color(0xFFE8781A),
                              shape: BoxShape.circle,
                            ),
                            child: const Center(
                                child: Text('✈', style: TextStyle(fontSize: 13))),
                          ),
                          const SizedBox(width: 10),
                          const Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text("Traveler's Tip",
                                    style: TextStyle(
                                        fontWeight: FontWeight.w700,
                                        fontSize: 12,
                                        color: Color(0xFF3D2B1A))),
                                SizedBox(height: 3),
                                Text(
                                    'Most curated safari trips are between 7–10 days to fully experience the trip flow without feeling rushed.',
                                    style: TextStyle(
                                        fontSize: 11,
                                        color: Color(0xFF6B5B3E),
                                        height: 1.4)),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),
                    OrangeButton(
                      label: 'Continue',
                      onTap: () => Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (_) => const PlanTripStep4Screen()),
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Center(
                      child: Text('Step 3 of 4',
                          style: TextStyle(
                              fontSize: 11, color: Color(0xFF9E8A70))),
                    ),
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

  Widget _counterBtn(IconData icon, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 44,
        height: 44,
        decoration: BoxDecoration(
          color: const Color(0xFFE8781A),
          shape: BoxShape.circle,
          boxShadow: [
            BoxShadow(
              color: const Color(0xFFE8781A).withOpacity(0.3),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Icon(icon, color: Colors.white, size: 20),
      ),
    );
  }
}
