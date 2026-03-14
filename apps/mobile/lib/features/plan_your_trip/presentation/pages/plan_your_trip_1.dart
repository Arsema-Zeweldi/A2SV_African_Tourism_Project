
import 'package:amona/screens/plan_your_trip/paln_trip_step_2.dart';
import 'package:amona/widgets/orange_button.dart';
import 'package:flutter/material.dart';

import '../../widgets/adventure_globe.dart';
import '../../widgets/surprises_chip.dart';
import '../../widgets/trip_bottom_nav.dart';
import 'trip_screen.dart';

class PlanTripStep1Screen extends StatefulWidget {
  const PlanTripStep1Screen({super.key});

  @override
  State<PlanTripStep1Screen> createState() => _PlanTripStep1ScreenState();
}

class _PlanTripStep1ScreenState extends State<PlanTripStep1Screen> {
  bool _multiCountry = true;

  final List<Map<String, String>> _gems = [
    {'name': 'Nairobi', 'emoji': '🏙'},
    {'name': 'Cape Town', 'emoji': '🏔'},
    {'name': 'Marrakesh', 'emoji': '🕌'},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            const TripAppBar(subtitle: 'Plan Your Trip', step: 1, totalSteps: 4),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Where would you like\nto go?',
                        style: TextStyle(
                            fontSize: 26,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFF1A1008),
                            height: 1.2)),
                    const SizedBox(height: 6),
                    const Text('Select your dream destinations in Africa.',
                        style: TextStyle(fontSize: 12, color: Color(0xFF9E8A70))),
                    const SizedBox(height: 20),
                    _locationField(Icons.location_on_outlined, 'Starting point'),
                    const SizedBox(height: 10),
                    _locationField(Icons.search, 'Search cities or countries'),
                    const SizedBox(height: 16),
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
                          const Icon(Icons.public,
                              color: Color(0xFFE8781A), size: 18),
                          const SizedBox(width: 10),
                          const Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('Multi-country trip',
                                    style: TextStyle(
                                        fontWeight: FontWeight.w700,
                                        fontSize: 13,
                                        color: Color(0xFF3D2B1A))),
                                Text('Roam between multiple borders',
                                    style: TextStyle(
                                        fontSize: 11, color: Color(0xFF9E8A70))),
                              ],
                            ),
                          ),
                          Switch(
                            value: _multiCountry,
                            onChanged: (v) => setState(() => _multiCountry = v),
                            activeColor: const Color(0xFFE8781A),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFF3D2B1A), Color(0xFF6B4423)],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Row(
                        children: [
                          const Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('Feeling adventurous?',
                                    style: TextStyle(
                                        color: Colors.white,
                                        fontWeight: FontWeight.w700,
                                        fontSize: 14)),
                                SizedBox(height: 4),
                                Text(
                                    'Let our experts pick a curated African experience based on your preferences.',
                                    style: TextStyle(
                                        color: Colors.white60,
                                        fontSize: 11,
                                        height: 1.4)),
                                SizedBox(height: 12),
                                SurpriseChip(),
                              ],
                            ),
                          ),
                          SizedBox(width: 12),
                          AdventureGlobe(),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Popular Gems',
                            style: TextStyle(
                                fontWeight: FontWeight.w700,
                                fontSize: 14,
                                color: Color(0xFF3D2B1A))),
                        const Text('View all',
                            style: TextStyle(
                                fontSize: 12,
                                color: Color(0xFFE8781A),
                                fontWeight: FontWeight.w600)),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: _gems
                          .map((g) => Expanded(
                        child: Padding(
                          padding: const EdgeInsets.only(right: 8),
                          child: Column(
                            children: [
                              Container(
                                width: 52,
                                height: 52,
                                decoration: BoxDecoration(
                                  color: const Color(0xFFF5F0E8),
                                  shape: BoxShape.circle,
                                  border: Border.all(
                                      color: const Color(0xFFE8D5B0)),
                                ),
                                child: Center(
                                    child: Text(g['emoji']!,
                                        style: const TextStyle(
                                            fontSize: 24))),
                              ),
                              const SizedBox(height: 4),
                              Text(g['name']!,
                                  style: const TextStyle(
                                      fontSize: 10,
                                      color: Color(0xFF6B5B3E))),
                            ],
                          ),
                        ),
                      ))
                          .toList(),
                    ),
                    const SizedBox(height: 24),
                    OrangeButton(
                      label: 'Continue',
                      onTap: () => Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (_) => const PlanTripStep2Screen()),
                      ),
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

  Widget _locationField(IconData icon, String hint) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 13),
      decoration: BoxDecoration(
        color: const Color(0xFFF5F0E8),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFE8D5B0)),
      ),
      child: Row(
        children: [
          Icon(icon, color: const Color(0xFFE8781A), size: 18),
          const SizedBox(width: 10),
          Text(hint,
              style: const TextStyle(color: Color(0xFFB0A090), fontSize: 13)),
        ],
      ),
    );
  }
}


