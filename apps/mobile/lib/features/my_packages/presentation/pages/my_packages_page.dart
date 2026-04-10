import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/core/constants/app_colors.dart';
import 'package:mobile/core/widgets/logo_header.dart';
import 'package:mobile/core/widgets/plan_trip_button.dart';
import 'package:mobile/features/my_packages/presentation/widgets/my_packages_card.dart';
import 'package:mobile/features/my_packages/presentation/widgets/my_package_search_bar.dart';
import 'package:mobile/features/my_packages/presentation/widgets/toggle_switch.dart';
import 'package:mobile/features/packages/presentation/bloc/package_bloc.dart';
import 'package:mobile/features/packages/presentation/bloc/package_event.dart';
import 'package:mobile/features/packages/presentation/bloc/package_state.dart';
import 'package:mobile/injection_container.dart' as di;

class MyPackages extends StatefulWidget {
  const MyPackages({super.key});

  @override
  State<MyPackages> createState() => _MyPackagesState();
}

class _MyPackagesState extends State<MyPackages> {
  bool isCurrentSelected = true;
  late final PackageBloc _myPackagesBloc;

  @override
  void initState() {
    super.initState();
    _myPackagesBloc = di.sl<PackageBloc>()..add(const LoadMyPackages());
  }

  @override
  void dispose() {
    _myPackagesBloc.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider.value(
      value: _myPackagesBloc,
      child: Scaffold(
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
              child: RefreshIndicator(
                onRefresh: () async {
                  _myPackagesBloc.add(const LoadMyPackages());
                  return Future.delayed(const Duration(seconds: 1));
                },
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
                        onToggle: (val) =>
                            setState(() => isCurrentSelected = val),
                      ),
                      const SizedBox(height: 20),
                      if (isCurrentSelected)
                        BlocBuilder<PackageBloc, PackageState>(
                          builder: (context, state) {
                            if (state is PackageLoading) {
                              return const Center(
                                  child: CircularProgressIndicator(
                                      color: AppColors.primaryOrange));
                            }

                            if (state is PackageError) {
                              return Center(
                                child: Column(
                                  children: [
                                    Text(state.message,
                                        style:
                                            const TextStyle(color: Colors.red)),
                                    TextButton(
                                      onPressed: () => _myPackagesBloc
                                          .add(const LoadMyPackages()),
                                      child: const Text('Retry'),
                                    ),
                                  ],
                                ),
                              );
                            }

                            if (state is MyPackagesLoaded) {
                              // Filter packages based on toggle
                              final packages = state.packages.where((pkg) {
                                if (isCurrentSelected) {
                                  // "Current" = not archived (status != 'archived')
                                  return pkg.status != 'archived';
                                } else {
                                  // "Saved" = archived/completed
                                  return pkg.status == 'archived';
                                }
                              }).toList();

                              if (packages.isEmpty) {
                                return Center(
                                  child: Column(
                                    children: [
                                      const Icon(Icons.inbox,
                                          size: 80, color: Colors.grey),
                                      const SizedBox(height: 12),
                                      Text(
                                        isCurrentSelected
                                            ? "No active packages"
                                            : "No saved packages",
                                        style: const TextStyle(
                                            fontSize: 16, color: Colors.grey),
                                      ),
                                    ],
                                  ),
                                );
                              }

                              return Column(
                                children: packages.map((pkg) {
                                  return MyPackagesCard(package: pkg);
                                }).toList(),
                              );
                            }

                            return const SizedBox.shrink();
                          },
                        )
                      else
                        const Center(
                          child: Column(
                            children: [
                              Icon(Icons.inbox, size: 80, color: Colors.grey),
                              SizedBox(height: 12),
                              Text(
                                "No saved packages yet",
                                style:
                                    TextStyle(fontSize: 16, color: Colors.grey),
                              ),
                            ],
                          ),
                        ),
                    ],
                  ),
                ),
              ),
            )
          ],
        )),
      ),
    );
  }
}
