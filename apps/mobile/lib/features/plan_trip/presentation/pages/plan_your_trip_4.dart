import 'package:mobile/core/constants/app_colors.dart';
import 'package:mobile/core/widgets/malak/orange_button.dart';
import 'package:flutter/material.dart';

import 'package:mobile/core/widgets/malak/trip_bottom_nav.dart';
import 'summary_screen.dart' show PlanTripSummaryScreen;
import 'trip_screen.dart';

class PlanTripStep4Screen extends StatefulWidget {
   final String destinations;
  final bool multiCountry;
  final String? climate;
  final List<String> vibes;
  final double budget;
  final int durationDays;
  final bool flexibleDates;
  const PlanTripStep4Screen({super.key, required this.destinations, required this.multiCountry, required this.climate, required this.vibes, required this.budget, required this.durationDays, required this.flexibleDates});

  @override
  State<PlanTripStep4Screen> createState() => _PlanTripStep4ScreenState();
}

class _PlanTripStep4ScreenState extends State<PlanTripStep4Screen> {
  final TextEditingController _notes = TextEditingController();
  final List<String> _selected = [];

  final List<Map<String, String>> _tags = [
    {'label': 'Vegan restaurants', 'emoji': '🥗'},
    {'label': 'Photography focus', 'emoji': '📷'},
    {'label': 'Quiet accommodations', 'emoji': '🏡'},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.scaffoldBackground,
      body: SafeArea(
        child: Column(
          children: [
            const TripAppBar(subtitle: 'Plan Your Trip', step: 4, totalSteps: 4),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Tell us more about your\ndream trip',
                        style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFF1A1008),
                            height: 1.2)),
                    const SizedBox(height: 6),
                    const Text(
                        'Anything else we should know before we start crafting your itinerary?',
                        style: TextStyle(fontSize: 12, color: Color(0xFF9E8A70))),
                    const SizedBox(height: 20),
                    Container(
                      decoration: BoxDecoration(
                        color: const Color(0xFFF5F0E8),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: const Color(0xFFE8D5B0)),
                      ),
                      child: TextField(
                        controller: _notes,
                        maxLines: 4,
                        style: const TextStyle(
                            fontSize: 13, color: Color(0xFF3D2B1A)),
                        decoration: const InputDecoration(
                          hintText:
                          'e.g. dietary requirements, specific activities, or accessibility needs...',
                          hintStyle: TextStyle(
                              fontSize: 12, color: Color(0xFFB0A090)),
                          border: InputBorder.none,
                          contentPadding: EdgeInsets.all(14),
                        ),
                      ),
                    ),
                    const SizedBox(height: 6),
                    const Align(
                      alignment: Alignment.centerRight,
                      child: Text('% OPTIONAL',
                          style: TextStyle(
                              fontSize: 10, color: Color(0xFF9E8A70))),
                    ),
                    const SizedBox(height: 16),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: _tags.map((t) {
                        final sel = _selected.contains(t['label']);
                        return GestureDetector(
                          onTap: () => setState(() {
                            sel
                                ? _selected.remove(t['label'])
                                : _selected.add(t['label']!);
                          }),
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 12, vertical: 8),
                            decoration: BoxDecoration(
                              color: sel
                                  ? const Color(0xFFE8781A)
                                  : const Color(0xFFF5F0E8),
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(
                                  color: sel
                                      ? const Color(0xFFE8781A)
                                      : const Color(0xFFE8D5B0)),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Text(t['emoji']!,
                                    style: const TextStyle(fontSize: 13)),
                                const SizedBox(width: 6),
                                Text(t['label']!,
                                    style: TextStyle(
                                        fontSize: 12,
                                        fontWeight: FontWeight.w600,
                                        color: sel
                                            ? Colors.white
                                            : const Color(0xFF6B5B3E))),
                              ],
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 20),
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
                              color: Color(0xFF4A7A5A),
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(Icons.shield_outlined,
                                color: Colors.white, size: 14),
                          ),
                          const SizedBox(width: 10),
                          const Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('Your Details are Secure',
                                    style: TextStyle(
                                        fontWeight: FontWeight.w700,
                                        fontSize: 12,
                                        color: Color(0xFF3D2B1A))),
                                SizedBox(height: 3),
                                Text(
                                    'This information helps our local experts personalize your experience and ensure your comfort.',
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
                      label: 'Complete',
                      onTap: () => Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => PlanTripSummaryScreen(
                          destination: widget.destinations,
                          climatePref: widget.climate,
                          durationDays: widget.durationDays,
                          vibeTags: widget.vibes,
                          budget: widget.budget,
                          notes: _notes.text.isNotEmpty ? _notes.text : null,
                        )),
                      ),
                      showArrow: false,
                    ),
                    const SizedBox(height: 8),
                    const Center(
                      child: Text('Step 4 of 4',
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
}
