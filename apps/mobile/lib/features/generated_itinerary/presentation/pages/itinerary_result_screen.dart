import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile/features/packages/domain/entities/package_entity.dart';
import 'package:mobile/features/packages/presentation/bloc/package_state.dart';
import 'package:mobile/features/planner/presentation/bloc/planner_event.dart';
import 'package:share_plus/share_plus.dart';
import 'package:mobile/core/constants/app_colors.dart';
import 'package:mobile/core/widgets/activity_map.dart';
import 'package:mobile/core/widgets/logo_header.dart';
import 'package:mobile/features/generated_itinerary/presentation/widgets/budget_tracker_card.dart';
import 'package:mobile/features/generated_itinerary/presentation/widgets/cost_breakdown_card.dart';
import 'package:mobile/features/generated_itinerary/presentation/widgets/itinerary_activity_item.dart';
import 'package:mobile/features/planner/presentation/bloc/planner_bloc.dart';
import 'package:mobile/features/planner/presentation/bloc/planner_state.dart';
import 'package:mobile/features/packages/presentation/bloc/package_bloc.dart';
import 'package:mobile/features/packages/presentation/bloc/package_event.dart';
import 'package:mobile/injection_container.dart' as di;

class ItineraryResultScreen extends StatefulWidget {
  static const routeName = "/itinerary-result-screen";
  const ItineraryResultScreen({super.key});

  @override
  State<ItineraryResultScreen> createState() => _ItineraryResultScreenState();
}

class _ItineraryResultScreenState extends State<ItineraryResultScreen> {
  bool _showMap = false;
  final Map<int, bool> _expandedDays = {};
  bool _isPublic = true; // Publish as Package switch state
  late PackageBloc _packageBloc;
  bool _isSaving = false;
  StreamSubscription<PlannerState>? _saveSubscription;

  @override
  void initState() {
    super.initState();
    _packageBloc = di.sl<PackageBloc>();
  }

  @override
  void dispose() {
    _saveSubscription?.cancel();
    super.dispose();
  }

  IconData _activityIcon(String type) {
    switch (type.toLowerCase()) {
      case 'food':
        return Icons.restaurant_menu_outlined;
      case 'adventure':
        return Icons.terrain_outlined;
      case 'culture':
        return Icons.museum_outlined;
      case 'party':
        return Icons.nightlife_outlined;
      case 'wildlife':
        return Icons.pets_outlined;
      default:
        return Icons.place_outlined;
    }
  }

  Color _activityColor(String type) {
    switch (type.toLowerCase()) {
      case 'food':
        return Colors.brown;
      case 'adventure':
        return Colors.green;
      case 'culture':
        return Colors.deepPurple;
      case 'party':
        return Colors.pink;
      case 'wildlife':
        return Colors.teal;
      default:
        return Colors.deepOrangeAccent;
    }
  }

  // Calculate cost breakdown from activities
  Map<String, double> _calculateCostBreakdown(List<dynamic> activities) {
    double accommodation = 0,
        transport = 0,
        activitiesCost = 0,
        food = 0,
        other = 0;
    for (final a in activities) {
      final costLabel = a.costLabel ?? ''; // ✅ fallback
      final cost =
          double.tryParse(costLabel.replaceAll(RegExp(r'[^\d.]'), '')) ?? 0;
      final type = (a.activityType ?? '').toLowerCase();
      switch (type) {
        case 'accommodation':
          accommodation += cost;
          break;
        case 'transport':
          transport += cost;
          break;
        case 'food':
          food += cost;
          break;
        case 'adventure':
        case 'culture':
        case 'wildlife':
        case 'party':
          activitiesCost += cost;
          break;
        default:
          other += cost;
      }
    }
    return {
      'accommodation': accommodation,
      'transport': transport,
      'activities': activitiesCost,
      'food': food,
      'other': other,
    };
  }

  // Share itinerary as text
  Future<void> _shareItinerary(
      String title, List<dynamic> activities, int days) async {
    StringBuffer buffer = StringBuffer();
    buffer.writeln('$title\n');
    buffer.writeln('Duration: $days days\n');

    final byDay = <int, List<dynamic>>{};
    for (final a in activities) byDay.putIfAbsent(a.dayNumber, () => []).add(a);
    final sortedDays = byDay.keys.toList()..sort();

    for (final day in sortedDays) {
      buffer.writeln('Day $day:');
      for (final a in byDay[day]!) {
        buffer.writeln('  • ${a.title} - ${a.costLabel}');
        if (a.description.isNotEmpty) buffer.writeln('    ${a.description}');
      }
      buffer.writeln();
    }

    await Share.share(buffer.toString(), subject: title);
  }

  void _saveItineraryAsPackage(Itinerary itinerary) {
    if (_isSaving) return;

    if (itinerary.id.isNotEmpty) {
      _showPackageSaveDialog(itinerary.id, itinerary.title,
          itinerary.description, itinerary.daysCount, itinerary.totalCostEst);
      return;
    }

    final plannerBloc = context.read<PlannerBloc>();
    _isSaving = true;

    const snackBar = SnackBar(
      content: const Row(children: [
        SizedBox(
            width: 20,
            height: 20,
            child: CircularProgressIndicator(strokeWidth: 2)),
        SizedBox(width: 12),
        Text('Saving itinerary...'),
      ]),
      duration: Duration(seconds: 30),
    );
    ScaffoldMessenger.of(context).showSnackBar(snackBar);

    // Listen for the save result (now expecting ItineraryGenerated)
    _saveSubscription = plannerBloc.stream.listen((state) {
      if (!mounted) return;
      if (state is ItineraryGenerated && state.itinerary.id.isNotEmpty) {
        // Save succeeded – close the snackbar
        ScaffoldMessenger.of(context).clearSnackBars();
        _saveSubscription?.cancel();
        _isSaving = false;
        // Now show the package save dialog using the new ID
        _showPackageSaveDialog(
          state.itinerary.id,
          state.itinerary.title,
          state.itinerary.description,
          state.itinerary.daysCount,
          state.itinerary.totalCostEst,
        );
      } else if (state is PlannerError) {
        ScaffoldMessenger.of(context).clearSnackBars();
        _saveSubscription?.cancel();
        _isSaving = false;
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content: Text('Failed: ${state.message}'),
              backgroundColor: Colors.red),
        );
      }
    });

    plannerBloc.add(SaveItineraryRequested(itinerary.toJson()));
  }

  void _showPackageSaveDialog(String itineraryId, String title,
      String description, int days, double cost) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Save Itinerary'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('Do you want to save this itinerary to "My Packages"?'),
            const SizedBox(height: 16),
            Row(
              children: [
                const Text('Visibility:'),
                const SizedBox(width: 16),
                Switch(
                  value: _isPublic,
                  onChanged: (val) => setState(() => _isPublic = val),
                  activeColor: Colors.orange,
                ),
                const SizedBox(width: 8),
                Text(_isPublic ? 'Public' : 'Private'),
              ],
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context); // close dialog
              _packageBloc.add(SavePackageRequested(
                itineraryId: itineraryId, // ✅ real UUID
                title: title,
                description: description,
                durationDays: days,
                totalCost: cost,
                status: _isPublic ? 'public' : 'private',
              ));
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                    content: Text('Saving package...'),
                    duration: Duration(seconds: 2)),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.orange),
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<PackageBloc, PackageState>(
      bloc: _packageBloc,
      listener: (context, state) {
        if (state is PackageSaved) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
                content: Text('Package saved successfully!'),
                backgroundColor: Colors.green),
          );
        } else if (state is PackageError) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
                content: Text('Error: ${state.message}'),
                backgroundColor: Colors.red),
          );
        }
      },
      child: Column(
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
                    icon: Icon(_showMap ? Icons.list_alt : Icons.map_outlined,
                        color: Colors.orange),
                    onPressed: () => setState(() => _showMap = !_showMap),
                  ),
                  IconButton(
                    icon:
                        const Icon(Icons.share_outlined, color: Colors.orange),
                    onPressed: () {
                      final state = context.read<PlannerBloc>().state;
                      if (state is ItineraryGenerated) {
                        _shareItinerary(
                            state.itinerary.title,
                            state.itinerary.activities,
                            state.itinerary.daysCount);
                      }
                    },
                  ),
                  const SizedBox(width: 8),
                ],
              ),
              floatingActionButton: FloatingActionButton(
                onPressed: () {
                  final state = context.read<PlannerBloc>().state;
                  if (state is ItineraryGenerated) {
                    _saveItineraryAsPackage(state.itinerary);
                  }
                },
                backgroundColor: Colors.orange,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(50)),
                child: const Icon(Icons.save_alt, color: Colors.white),
              ),
              body: BlocBuilder<PlannerBloc, PlannerState>(
                builder: (context, state) {
                  if (state is PlannerLoading) {
                    return const Center(
                        child: CircularProgressIndicator(
                            color: AppColors.primaryOrange));
                  }
                  if (state is PlannerError) {
                    return Center(
                        child: Text(state.message,
                            style: const TextStyle(color: Colors.red)));
                  }
                  if (state is ItineraryGenerated) {
                    final itinerary = state.itinerary;

                    final activitiesByDay = <int, List<dynamic>>{};
                    for (final a in itinerary.activities) {
                      activitiesByDay.putIfAbsent(a.dayNumber, () => []).add(a);
                    }
                    final sortedDays = activitiesByDay.keys.toList()..sort();
                    for (final day in sortedDays) {
                      _expandedDays.putIfAbsent(
                          day, () => day == sortedDays.first);
                    }

                    final costs = _calculateCostBreakdown(itinerary.activities);

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
                          activities: mapActivities, height: double.infinity);
                    }

                    return SingleChildScrollView(
                      padding: const EdgeInsets.all(20),
                      child: Column(children: [
                        BudgetTrackerCard(
                          totalCost: itinerary.totalCostEst,
                          budgetLimit: itinerary.totalCostEst * 1.5,
                        ),
                        const SizedBox(height: 24),
                        ...sortedDays.map((dayNum) {
                          final dayActivities = activitiesByDay[dayNum]!;
                          final isExpanded = _expandedDays[dayNum]!;
                          return Column(children: [
                            _buildDayHeader(
                              'Day $dayNum',
                              isExpanded,
                              subtitle:
                                  '${dayActivities.length} Activities · \$${dayActivities.fold<double>(0, (sum, a) => sum + (double.tryParse(a.costLabel.replaceAll(RegExp(r'[^\d.]'), '')) ?? 0)).toStringAsFixed(0)}',
                              onToggle: () => setState(
                                  () => _expandedDays[dayNum] = !isExpanded),
                            ),
                            const SizedBox(height: 12),
                            if (isExpanded)
                              ...dayActivities.map((a) => Padding(
                                    padding: const EdgeInsets.only(bottom: 12),
                                    child: ItineraryActivityItem(
                                      icon: _activityIcon(a.activityType),
                                      title: a.title,
                                      subtitle: a.description.isNotEmpty
                                          ? a.description
                                          : a.location,
                                      price: double.tryParse(a.costLabel
                                              .replaceAll(
                                                  RegExp(r'[^\d.]'), '')) ??
                                          0,
                                      iconBgColor:
                                          _activityColor(a.activityType),
                                    ),
                                  )),
                            const SizedBox(height: 16),
                          ]);
                        }),
                        const SizedBox(height: 8),
                        CostBreakdownCard(
                          accommodationCost: costs['accommodation']!,
                          transportCost: costs['transport']!,
                          activitiesCost: costs['activities']!,
                          foodCost: costs['food']!,
                          otherCost:
                              costs['other']! > 0 ? costs['other'] : null,
                        ),
                        const SizedBox(height: 20),
                        _buildSwitchTile("Publish as Package",
                            "Visible to other travelers", _isPublic, (val) {
                          setState(() => _isPublic = val);
                        }),
                        const SizedBox(height: 80),
                      ]),
                    );
                  }
                  return const Center(
                      child: Text('No itinerary generated yet.'));
                },
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDayHeader(String title, bool isExpanded,
      {String? subtitle, required VoidCallback onToggle}) {
    return GestureDetector(
      onTap: onToggle,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isExpanded ? const Color(0xFF435334) : Colors.white,
          borderRadius: BorderRadius.circular(30),
          border: isExpanded ? null : Border.all(color: Colors.grey.shade100),
        ),
        child: Row(children: [
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
              ])),
          Icon(
              isExpanded
                  ? Icons.keyboard_arrow_down
                  : Icons.keyboard_arrow_right,
              color: isExpanded ? Colors.white : Colors.grey),
        ]),
      ),
    );
  }

  Widget _buildSwitchTile(
      String title, String subtitle, bool value, Function(bool) onChanged) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.grey.shade100),
      ),
      child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
        Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
          Text(subtitle,
              style: const TextStyle(color: Colors.grey, fontSize: 12)),
        ]),
        Switch(value: value, onChanged: onChanged, activeColor: Colors.orange),
      ]),
    );
  }
}
