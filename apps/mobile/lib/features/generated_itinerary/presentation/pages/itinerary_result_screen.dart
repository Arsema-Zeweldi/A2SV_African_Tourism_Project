import 'package:flutter/material.dart';
import 'package:mobile/core/constants/app_colors.dart';
import 'package:mobile/core/widgets/logo_header.dart';
import 'package:mobile/features/generated_itinerary/presentation/widgets/budget_tracker_card.dart';
import 'package:mobile/features/generated_itinerary/presentation/widgets/cost_breakdown_card.dart';
import 'package:mobile/features/generated_itinerary/presentation/widgets/itinerary_activity_item.dart';

class ItineraryResultScreen extends StatelessWidget {
  static const routeName = "/itinerary-result-screen";
  const ItineraryResultScreen({super.key});

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
              leading: const Icon(Icons.arrow_back_ios, color: Colors.orange),
              title: const Text("Your Adventure",
                  style: TextStyle(
                      color: Color(0xFF1B254B), fontWeight: FontWeight.bold)),
              centerTitle: true,
              actions: const [
                Icon(Icons.share_outlined, color: Colors.orange),
                SizedBox(width: 16)
              ],
            ),
            floatingActionButton: FloatingActionButton(
              onPressed: () {},
              backgroundColor: Colors.orange,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(50)),
              child: const Icon(Icons.add, color: Colors.white),
            ),
            body: SingleChildScrollView(
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
                  _buildSwitchTile(
                      "Publish as Package", "Visible to other travelers"),
                  const SizedBox(height: 80),
                ],
              ),
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
