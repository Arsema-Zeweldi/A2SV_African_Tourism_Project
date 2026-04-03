
import 'package:mobile/features/plan_trip/presentation/pages/plan_your_trip_3.dart';
import 'package:mobile/features/plan_trip/presentation/pages/trip_screen.dart';
import 'package:mobile/core/widgets/malak/orange_button.dart';
import 'package:mobile/core/widgets/malak/trip_bottom_nav.dart';
import 'package:flutter/material.dart';

class PlanTripStep2Screen extends StatefulWidget {
  const PlanTripStep2Screen({super.key});

  @override
  State<PlanTripStep2Screen> createState() => _PlanTripStep2ScreenState();
}

class _PlanTripStep2ScreenState extends State<PlanTripStep2Screen> {
  String? _selectedClimate;
  final List<String> _selectedVibes = ['Adventure'];
  double _budget = 1800;

  final List<Map<String, dynamic>> _climates = [
    {'label': 'Savanna', 'emoji': '🌾', 'color': const Color(0xFFD4A853)},
    {'label': 'Coastal', 'emoji': '🌊', 'color': const Color(0xFF4A90B8)},
    {'label': 'Highland', 'emoji': '⛰', 'color': const Color(0xFF5A7A5A)},
  ];

  final List<String> _vibes = [
    'Adventure', 'Relaxation', 'Cultural', 'Nightlife', 'Wellness'
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            const TripAppBar(subtitle: 'Plan Your Trip', step: 2, totalSteps: 4),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text("What's your ideal\nsetting?",
                        style: TextStyle(
                            fontSize: 26,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFF1A1008),
                            height: 1.2)),
                    const SizedBox(height: 6),
                    const Text('Pick a climate that suits your soul.',
                        style: TextStyle(fontSize: 12, color: Color(0xFF9E8A70))),
                    const SizedBox(height: 18),
                    GridView.count(
                      crossAxisCount: 2,
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      crossAxisSpacing: 10,
                      mainAxisSpacing: 10,
                      childAspectRatio: 1.3,
                      children: _climates.map((c) {
                        final selected = _selectedClimate == c['label'];
                        return GestureDetector(
                          onTap: () => setState(
                                  () => _selectedClimate = c['label'] as String),
                          child: Container(
                            decoration: BoxDecoration(
                              color: (c['color'] as Color).withOpacity(0.15),
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(
                                color: selected
                                    ? const Color(0xFFE8781A)
                                    : Colors.transparent,
                                width: 2,
                              ),
                            ),
                            child: Stack(
                              children: [
                                Center(
                                  child: Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Text(c['emoji'] as String,
                                          style: const TextStyle(fontSize: 32)),
                                      const SizedBox(height: 6),
                                      Text(c['label'] as String,
                                          style: const TextStyle(
                                              fontWeight: FontWeight.w700,
                                              fontSize: 13,
                                              color: Color(0xFF3D2B1A))),
                                    ],
                                  ),
                                ),
                                if (selected)
                                  Positioned(
                                    top: 8,
                                    right: 8,
                                    child: Container(
                                      width: 20,
                                      height: 20,
                                      decoration: const BoxDecoration(
                                        color: Color(0xFFE8781A),
                                        shape: BoxShape.circle,
                                      ),
                                      child: const Icon(Icons.check,
                                          color: Colors.white, size: 12),
                                    ),
                                  ),
                              ],
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 22),
                    const Text("What's the vibe?",
                        style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFF1A1008))),
                    const SizedBox(height: 4),
                    const Text('How do you want to feel?',
                        style: TextStyle(fontSize: 12, color: Color(0xFF9E8A70))),
                    const SizedBox(height: 12),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: _vibes.map((v) {
                        final sel = _selectedVibes.contains(v);
                        return GestureDetector(
                          onTap: () => setState(() {
                            sel ? _selectedVibes.remove(v) : _selectedVibes.add(v);
                          }),
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 14, vertical: 8),
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
                            child: Text(v,
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
                    const SizedBox(height: 22),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Budget',
                            style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w800,
                                color: Color(0xFF1A1008))),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Text('\$${_budget.toStringAsFixed(0)}',
                                style: const TextStyle(
                                    color: Color(0xFFE8781A),
                                    fontWeight: FontWeight.w800,
                                    fontSize: 16)),
                            const Text('USD',
                                style: TextStyle(
                                    color: Color(0xFF9E8A70), fontSize: 10)),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    const Text('Estimated total per person',
                        style: TextStyle(fontSize: 11, color: Color(0xFF9E8A70))),
                    SliderTheme(
                      data: SliderTheme.of(context).copyWith(
                        activeTrackColor: const Color(0xFFE8781A),
                        inactiveTrackColor: const Color(0xFFE8D5B0),
                        thumbColor: const Color(0xFFE8781A),
                        overlayColor:
                        const Color(0xFFE8781A).withOpacity(0.2),
                        trackHeight: 4,
                      ),
                      child: Slider(
                        value: _budget,
                        min: 500,
                        max: 10000,
                        onChanged: (v) => setState(() => _budget = v),
                      ),
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: const [
                        Text('\$500',
                            style: TextStyle(
                                fontSize: 10, color: Color(0xFF9E8A70))),
                        Text('\$10,000+',
                            style: TextStyle(
                                fontSize: 10, color: Color(0xFF9E8A70))),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFFF8F0),
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: const Color(0xFFE8D5B0)),
                      ),
                      child: Row(
                        children: const [
                          Icon(Icons.info_outline,
                              color: Color(0xFFE8781A), size: 14),
                          SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              'This estimate includes international flights to help us find the best local packages.',
                              style: TextStyle(
                                  fontSize: 11,
                                  color: Color(0xFF9E8A70),
                                  height: 1.4),
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
                            builder: (_) => const PlanTripStep3Screen()),
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Center(
                      child: Text('Step 2 of 4',
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
