// TODO: Replace this placeholder with the real Plan Your Trip wizard (see Figma).
//
// CONTRACT — Your screen must:
//   1. Keep the class name: PlanTripScreen
//   2. Keep the file at this exact path
//   3. Implement a 4-step wizard:
//        Step 1 — Location (destination, starting point, multi-country toggle)
//        Step 2 — Preferences (climate, vibe tags, budget slider)
//        Step 3 — Duration (day counter, flexible dates)
//        Step 4 — Open Question (additional details text field)
//   4. After step 4, show a Summary/Review screen
//   5. On "Generate My Itinerary", call the backend:
//        POST /api/v1/planner/generate
//        Body: {
//          "destination": String,
//          "duration_days": int,
//          "budget_level": "low" | "medium" | "high" | "luxury",
//          "vibe_tags": ["adventure", "relaxed", "foodie", "history", "party", "culture", "wildlife"],
//          "climate_pref": "tropical" | "desert" | "coastal" | "highland" | "temperate" | "any",
//          "group_size": int,
//          "multi_country": bool,
//          "notes": String
//        }
//   6. On success, navigate to the itinerary result screen with the generated data

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/core/constants/app_colors.dart';

class PlanTripScreen extends StatelessWidget {
  const PlanTripScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.scaffoldBackground,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: AppColors.primaryDark),
          onPressed: () => context.pop(),
        ),
        title: Image.asset('assets/images/logo&name.png', height: 30),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Step indicator
              Row(
                children: List.generate(
                  4,
                  (i) => Expanded(
                    child: Container(
                      height: 4,
                      margin: const EdgeInsets.symmetric(horizontal: 2),
                      decoration: BoxDecoration(
                        color: i == 0
                            ? AppColors.primaryOrange
                            : Colors.grey.shade300,
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 32),
              const Text(
                'Where would you like\nto go?',
                style: TextStyle(
                  fontSize: 26,
                  fontWeight: FontWeight.bold,
                  color: AppColors.primaryDark,
                  height: 1.3,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Select your dream destinations in Africa.',
                style: TextStyle(fontSize: 14, color: Colors.grey.shade600),
              ),
              const SizedBox(height: 24),
              // Placeholder destination input
              TextField(
                decoration: InputDecoration(
                  hintText: 'Search cities or countries',
                  prefixIcon:
                      const Icon(Icons.location_on, color: AppColors.primaryOrange),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.grey.shade300),
                  ),
                ),
              ),
              const Spacer(),
              // Placeholder "Continue" button
              ElevatedButton(
                onPressed: () {
                  // TODO: Navigate to step 2 (or handle internally with PageView)
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text(
                        'Plan Trip wizard coming soon — this is a placeholder.',
                      ),
                    ),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primaryOrange,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(28),
                  ),
                ),
                child: const Text(
                  'Continue →',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ),
              const SizedBox(height: 12),
              Center(
                child: Text(
                  'STEP 1 OF 4',
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey.shade500,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }
}
