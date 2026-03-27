import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/core/constants/app_colors.dart';
import 'package:mobile/core/widgets/logo_header.dart';
import 'package:mobile/core/widgets/plan_trip_button.dart';
import 'package:mobile/features/my_packages/presentation/widgets/my_package_list.dart';
import 'package:mobile/features/my_packages/presentation/widgets/my_package_search_bar.dart';
import 'package:mobile/features/my_packages/presentation/widgets/toggle_switch.dart';

class MyPackages extends StatefulWidget {
  const MyPackages({super.key});

  @override
  State<MyPackages> createState() => _MyPackagesState();
}

class _MyPackagesState extends State<MyPackages> {
  bool isCurrentSelected = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.scaffoldBackground,
      floatingActionButton: PlanTripButton(onPressed: () {
        context.push('/plan-trip');
      }),
      body: SafeArea(
          child: Column(
        children: [
          const SizedBox(height: 6),
          const LogoHeader(),
          const SizedBox(height: 28),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'My Packages',
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  const MyPackageSearchBar(),
                  const SizedBox(height: 16),
                  ToggleSwitch(
                    isCurrentSelected: isCurrentSelected,
                    onToggle: (val) => setState(() => isCurrentSelected = val),
                  ),
                  const SizedBox(height: 20),
                  if (isCurrentSelected)
                    MyPackageList()
                  else
                    const Center(
                      child: Column(
                        children: [
                          Icon(Icons.inbox, size: 80, color: Colors.grey),
                          SizedBox(height: 12),
                          Text(
                            "No saved packages yet",
                            style: TextStyle(fontSize: 16, color: Colors.grey),
                          ),
                        ],
                      ),
                    ),
                ],
              ),
            ),
          )
        ],
      )),
    );
  }
}
