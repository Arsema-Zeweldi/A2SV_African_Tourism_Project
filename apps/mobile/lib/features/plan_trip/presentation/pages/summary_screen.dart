import 'package:mobile/features/plan_trip/presentation/pages/trip_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
// import 'package:go_router/go_router.dart';

import 'package:mobile/core/widgets/malak/trip_bottom_nav.dart';
import 'package:mobile/features/planner/presentation/bloc/planner_bloc.dart';
import 'package:mobile/features/planner/presentation/bloc/planner_event.dart';
import 'package:mobile/features/planner/presentation/bloc/planner_state.dart';
import 'package:mobile/features/planner/domain/entities/planner_entity.dart';
import 'package:mobile/features/generated_itinerary/presentation/pages/itinerary_result_screen.dart';

class PlanTripSummaryScreen extends StatelessWidget {
  final String? destination;
  final String? climatePref;
  final int? durationDays;
  final List<String>? vibeTags;
  final double? budget;
  final String? budgetLevel;
  final String? notes;

  const PlanTripSummaryScreen({
    super.key,
    this.destination,
    this.climatePref,
    this.durationDays,
    this.vibeTags,
    this.budget,
    this.budgetLevel,
    this.notes,
  });

  // Map frontend climate selections to backend expected values
  String _mapClimatePref(String? climate) {
    switch (climate?.toLowerCase()) {
      case 'savanna':
        return 'tropical';
      case 'coastal':
        return 'coastal';
      case 'highland':
        return 'highland';
      default:
        return 'tropical';
    }
  }

  @override
  Widget build(BuildContext context) {
    // Use real params or sensible defaults.
    final dest = destination ?? 'Maasai Mara, Kenya';
    final climate = climatePref ?? 'tropical';
    final days = durationDays ?? 10;
    final vibes = vibeTags ?? ['adventure', 'wildlife'];
    final bLevel = budgetLevel ?? 'high';
    final tripNotes = notes ?? '';
    final tripBudget = budget;

    // Map climate to backend format
    final mappedClimate = _mapClimatePref(climate);
    // Convert vibe tags to lowercase for backend
    final mappedVibes = vibes.map((v) => v.toLowerCase()).toList();

    // Human-readable labels for the summary cards.
    String climateLabel;
    switch (mappedClimate) {
      case 'tropical':
        climateLabel = 'Warm & Sunny';
        break;
      case 'coastal':
        climateLabel = 'Coastal Breeze';
        break;
      case 'highland':
        climateLabel = 'Cool Highlands';
        break;
      default:
        climateLabel = 'Any Climate';
    }

    String budgetLabel;
    switch (bLevel) {
      case 'low':
        budgetLabel = 'Budget (\$)';
        break;
      case 'medium':
        budgetLabel = 'Standard (\$\$)';
        break;
      case 'high':
        budgetLabel = 'Premium (\$\$\$)';
        break;
      case 'luxury':
        budgetLabel = 'Luxury (\$\$\$\$)';
        break;
      default:
        budgetLabel = 'Premium (\$\$\$)';
    }

    String vibeLabel = mappedVibes.isNotEmpty
        ? mappedVibes.map((v) => v[0].toUpperCase() + v.substring(1)).join(' & ')
        : 'Adventure & Wildlife';

    final items = [
      {'icon': '📍', 'label': 'DESTINATION', 'value': dest},
      {'icon': '☀', 'label': 'CLIMATE', 'value': climateLabel},
      {'icon': '📅', 'label': 'DURATION', 'value': '$days Days'},
      {'icon': '✨', 'label': 'VIBE', 'value': vibeLabel},
      {'icon': '💰', 'label': 'BUDGET', 'value': budgetLabel},
    ];

    return Scaffold(
      backgroundColor: Colors.white,
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
                    const Text('Review Your', style: TextStyle(fontSize: 28, fontWeight: FontWeight.w800, color: Color(0xFF1A1008), height: 1.1)),
                    const Text('Dream Escape', style: TextStyle(fontSize: 28, fontWeight: FontWeight.w800, color: Color(0xFFE8781A), fontStyle: FontStyle.italic, height: 1.1)),
                    const SizedBox(height: 6),
                    const Text("We've captured your preferences. Does everything look perfect?", style: TextStyle(fontSize: 12, color: Color(0xFF9E8A70))),
                    const SizedBox(height: 20),
                    ...items.map((item) => Container(
                      margin: const EdgeInsets.only(bottom: 10),
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                      decoration: BoxDecoration(color: const Color(0xFFFAF7F2), borderRadius: BorderRadius.circular(14), border: Border.all(color: const Color(0xFFE8D5B0))),
                      child: Row(
                        children: [
                          Container(width: 38, height: 38, decoration: BoxDecoration(color: const Color(0xFFFFF0E0), borderRadius: BorderRadius.circular(10)), child: Center(child: Text(item['icon']!, style: const TextStyle(fontSize: 18)))),
                          const SizedBox(width: 12),
                          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                            Text(item['label']!, style: const TextStyle(fontSize: 9, letterSpacing: 1.2, color: Color(0xFF9E8A70), fontWeight: FontWeight.w700)),
                            const SizedBox(height: 2),
                            Text(item['value']!, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: Color(0xFF3D2B1A))),
                          ])),
                          GestureDetector(
                            onTap: () => Navigator.pop(context),
                            child: Container(padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4), decoration: BoxDecoration(color: const Color(0xFFF5F0E8), borderRadius: BorderRadius.circular(8), border: Border.all(color: const Color(0xFFE8D5B0))),
                              child: const Text('Edit', style: TextStyle(fontSize: 11, color: Color(0xFF9E8A70), fontWeight: FontWeight.w600)),
                            ),
                          ),
                        ],
                      ),
                    )),
                    const SizedBox(height: 16),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(16),
                      child: Container(height: 120, decoration: const BoxDecoration(gradient: LinearGradient(colors: [Color(0xFFD4A853), Color(0xFF8B6914)])),
                        child: Stack(children: [const Center(child: Text('🌅', style: TextStyle(fontSize: 60))), Container(decoration: BoxDecoration(gradient: LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter, colors: [Colors.transparent, Colors.black.withOpacity(0.3)])))])),
                    ),
                    const SizedBox(height: 12),
                    const Text('Disclaimer: We facilitate itinerary generation and community connection. On-ground services are managed by third-party agents.', style: TextStyle(fontSize: 10, color: Color(0xFF9E8A70), height: 1.4), textAlign: TextAlign.center),
                    const SizedBox(height: 20),
                    BlocListener<PlannerBloc, PlannerState>(
                      listener: (context, state) {
                        if (state is ItineraryGenerated) {
                          Navigator.push(context, MaterialPageRoute(builder: (_) => const ItineraryResultScreen()));
                        } else if (state is PlannerError) {
                          ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(state.message), backgroundColor: Colors.red));
                        }
                      },
                      child: const SizedBox.shrink(),
                    ),
                    BlocBuilder<PlannerBloc, PlannerState>(
                      builder: (context, state) {
                        final isLoading = state is PlannerLoading;
                        return GestureDetector(
                          onTap: isLoading ? null : () {
                            context.read<PlannerBloc>().add(
                              GenerateItineraryRequested(
                                GeneratePlanRequest(
                                  destination: dest,
                                  durationDays: days,
                                  budget: tripBudget,
                                  budgetLevel: bLevel,
                                  vibeTags: mappedVibes,
                                  climatePref: mappedClimate,
                                  notes: tripNotes,
                                ),
                              ),
                            );
                          },
                          child: Container(
                            width: double.infinity, height: 54,
                            decoration: BoxDecoration(
                              gradient: LinearGradient(colors: isLoading ? [const Color(0xFF6B5B3E), const Color(0xFF8B7B5E)] : [const Color(0xFF3D2B1A), const Color(0xFF6B4423)]),
                              borderRadius: BorderRadius.circular(14),
                              boxShadow: [BoxShadow(color: const Color(0xFF3D2B1A).withOpacity(0.4), blurRadius: 16, offset: const Offset(0, 6))],
                            ),
                            child: Row(mainAxisAlignment: MainAxisAlignment.center, children: isLoading
                              ? [const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2)), const SizedBox(width: 12), const Text('Crafting your itinerary...', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 13))]
                              : [const Text('✨ ', style: TextStyle(fontSize: 16)), const Text('GENERATE MY ITINERARY', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 13, letterSpacing: 0.8))]
                            ),
                          ),
                        );
                      },
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