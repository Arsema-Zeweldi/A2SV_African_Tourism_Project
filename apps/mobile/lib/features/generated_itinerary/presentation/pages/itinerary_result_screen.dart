import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile/core/constants/app_colors.dart';
import 'package:mobile/core/widgets/activity_map.dart';
import 'package:mobile/core/widgets/logo_header.dart';
import 'package:mobile/features/generated_itinerary/presentation/widgets/budget_tracker_card.dart';
import 'package:mobile/features/generated_itinerary/presentation/widgets/cost_breakdown_card.dart';
import 'package:mobile/features/generated_itinerary/presentation/widgets/itinerary_activity_item.dart';
import 'package:mobile/features/planner/presentation/bloc/planner_bloc.dart';
import 'package:mobile/features/planner/presentation/bloc/planner_state.dart';

class ItineraryResultScreen extends StatefulWidget {
  static const routeName = "/itinerary-result-screen";
  const ItineraryResultScreen({super.key});

  @override
  State<ItineraryResultScreen> createState() => _ItineraryResultScreenState();
}

class _ItineraryResultScreenState extends State<ItineraryResultScreen> {
  bool _showMap = false;

  IconData _activityIcon(String type) {
    switch (type.toLowerCase()) {
      case 'food': return Icons.restaurant_menu_outlined;
      case 'adventure': return Icons.terrain_outlined;
      case 'culture': return Icons.museum_outlined;
      case 'party': return Icons.nightlife_outlined;
      case 'wildlife': return Icons.pets_outlined;
      default: return Icons.place_outlined;
    }
  }

  Color _activityColor(String type) {
    switch (type.toLowerCase()) {
      case 'food': return Colors.brown;
      case 'adventure': return Colors.green;
      case 'culture': return Colors.deepPurple;
      case 'party': return Colors.pink;
      case 'wildlife': return Colors.teal;
      default: return Colors.deepOrangeAccent;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          width: double.infinity,
          color: AppColors.scaffoldBackground,
          padding: const EdgeInsets.only(top: 50, bottom: 10),
          child: const LogoHeader(),
        ),
        Expanded(
          child: Scaffold(
            appBar: AppBar(
              backgroundColor: Colors.transparent,
              elevation: 0,
              leading: IconButton(
                icon: const Icon(Icons.arrow_back_ios, color: Colors.orange),
                onPressed: () => Navigator.pop(context),
              ),
              title: const Text("Your Adventure",
                  style: TextStyle(
                      color: Color(0xFF1B254B), fontWeight: FontWeight.bold)),
              centerTitle: true,
              actions: [
                IconButton(
                  icon: Icon(
                    _showMap ? Icons.list_alt : Icons.map_outlined,
                    color: Colors.orange,
                  ),
                  onPressed: () => setState(() => _showMap = !_showMap),
                  tooltip: _showMap ? 'Show list' : 'Show map',
                ),
                const Icon(Icons.share_outlined, color: Colors.orange),
                const SizedBox(width: 16),
              ],
            ),
            floatingActionButton: FloatingActionButton(
              onPressed: () {},
              backgroundColor: Colors.orange,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(50)),
              child: const Icon(Icons.add, color: Colors.white),
            ),
            body: BlocBuilder<PlannerBloc, PlannerState>(
              builder: (context, state) {
                if (state is PlannerLoading) {
                  return const Center(child: CircularProgressIndicator(color: AppColors.primaryOrange));
                }

                if (state is PlannerError) {
                  return Center(child: Text(state.message, style: const TextStyle(color: Colors.red)));
                }

                if (state is ItineraryGenerated) {
                  final itinerary = state.itinerary;
                  final activitiesByDay = <int, List<dynamic>>{};
                  for (final a in itinerary.activities) {
                    activitiesByDay.putIfAbsent(a.dayNumber, () => []);
                    activitiesByDay[a.dayNumber]!.add(a);
                  }
                  final sortedDays = activitiesByDay.keys.toList()..sort();

                  if (_showMap) {
                    final mapActivities = itinerary.activities
                        .map((a) => MapActivity(
                              title: a.title,
                              description: a.description,
                              location: a.location,
                              latitude: a.latitude,
                              longitude: a.longitude,
                            ))
                        .toList();
                    return ActivityMapView(
                      activities: mapActivities,
                      height: double.infinity,
                    );
                  }

                  return SingleChildScrollView(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      children: [
                        BudgetTrackerCard(
                          totalCost: itinerary.totalCostEst,
                          budgetLimit: itinerary.totalCostEst * 1.5,
                        ),
                        const SizedBox(height: 24),
                        ...sortedDays.expand((dayNum) {
                          final dayActivities = activitiesByDay[dayNum]!;
                          final isFirst = dayNum == sortedDays.first;
                          return [
                            _buildDayHeader(
                              'Day $dayNum',
                              isFirst,
                              subtitle: isFirst ? null : '${dayActivities.length} Activities',
                            ),
                            const SizedBox(height: 12),
                            if (isFirst)
                              ...dayActivities.map((a) => ItineraryActivityItem(
                                icon: _activityIcon(a.activityType),
                                title: a.title,
                                subtitle: a.description.isNotEmpty ? a.description : a.location,
                                price: double.tryParse(a.costLabel.replaceAll(RegExp(r'[^\d.]'), '')) ?? 0,
                                iconBgColor: _activityColor(a.activityType),
                              )),
                            const SizedBox(height: 16),
                          ];
                        }),
                        const CostBreakdownCard(),
                        const SizedBox(height: 20),
                        _buildSwitchTile("Publish as Package", "Visible to other travelers"),
                        const SizedBox(height: 80),
                      ],
                    ),
                  );
                }

                // Fallback: show hardcoded placeholder
                return SingleChildScrollView(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    children: [
                      const BudgetTrackerCard(totalCost: 320, budgetLimit: 500),
                      const SizedBox(height: 24),
                      _buildDayHeader("Day 1: Arrival & Briefing", true),
                      const SizedBox(height: 12),
                      const ItineraryActivityItem(
                        icon: Icons.airport_shuttle_outlined,
                        title: "Airport Shuttle",
                        subtitle: "JRO Terminal to Arusha Hotel",
                        price: 20,
                        iconBgColor: Colors.deepOrangeAccent,
                      ),
                      const ItineraryActivityItem(
                        icon: Icons.restaurant_menu_outlined,
                        title: "Local Bistro Lunch",
                        subtitle: "Traditional Tanzanian cuisine",
                        price: 35,
                        iconBgColor: Colors.brown,
                      ),
                      const ItineraryActivityItem(
                        icon: Icons.terrain_outlined,
                        title: "Guided Safari Tour",
                        subtitle: "Evening wildlife viewing",
                        price: 150,
                        iconBgColor: Colors.green,
                      ),
                      const SizedBox(height: 16),
                      _buildDayHeader("Day 2: Serengeti Plains", false,
                          subtitle: "2 Activities • \$80"),
                      const SizedBox(height: 12),
                      _buildDayHeader("Day 3: Ngorongoro Crater", false,
                          subtitle: "3 Activities • \$120"),
                      const SizedBox(height: 24),
                      const CostBreakdownCard(),
                      const SizedBox(height: 20),
                      _buildSwitchTile("Publish as Package", "Visible to other travelers"),
                      const SizedBox(height: 80),
                    ],
                  ),
                );
              },
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildDayHeader(String title, bool isExpanded, {String? subtitle}) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isExpanded ? const Color(0xFF435334) : Colors.white,
        borderRadius: BorderRadius.circular(30),
        border: isExpanded ? null : Border.all(color: Colors.grey.shade100),
      ),
      child: Row(
        children: [
          Icon(Icons.calendar_today_outlined,
              color: isExpanded ? Colors.orange : Colors.grey, size: 20),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title,
                    style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: isExpanded
                            ? Colors.white
                            : const Color(0xFF1B254B))),
                if (subtitle != null)
                  Text(subtitle,
                      style: const TextStyle(color: Colors.grey, fontSize: 12)),
              ],
            ),
          ),
          Icon(
              isExpanded
                  ? Icons.keyboard_arrow_down
                  : Icons.keyboard_arrow_right,
              color: isExpanded ? Colors.white : Colors.grey),
        ],
      ),
    );
  }

  Widget _buildSwitchTile(String title, String subtitle) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.grey.shade100),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
              Text(subtitle,
                  style: const TextStyle(color: Colors.grey, fontSize: 12)),
            ],
          ),
          Switch(value: true, onChanged: (v) {}, activeColor: Colors.orange),
        ],
      ),
    );
  }
}
