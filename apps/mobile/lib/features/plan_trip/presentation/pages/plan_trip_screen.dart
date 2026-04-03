// PlanTripScreen — entry point for the Plan Your Trip wizard.
//
// This simply delegates to PlanTripStep1Screen, which internally
// navigates through steps 2 → 3 → 4 → Summary using Navigator.push.
// The GoRouter route at '/plan-trip' points here.

import 'package:flutter/material.dart';
import 'package:mobile/features/plan_trip/presentation/pages/plan_your_trip_1.dart';

class PlanTripScreen extends StatelessWidget {
  const PlanTripScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const PlanTripStep1Screen();
  }
}
