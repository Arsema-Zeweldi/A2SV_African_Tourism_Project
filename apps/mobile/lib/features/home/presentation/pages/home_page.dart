import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/core/constants/app_colors.dart';
import 'package:mobile/core/widgets/category_toggle.dart';
import 'package:mobile/core/widgets/headers_widget.dart';
import 'package:mobile/core/widgets/plan_trip_button.dart';
import 'package:mobile/features/home/presentation/widgets/community_card.dart';
import 'package:mobile/features/home/presentation/widgets/package_card.dart';
import 'package:mobile/features/market_place/presentation/pages/package_detail_page.dart';
import 'package:mobile/features/packages/presentation/bloc/package_bloc.dart';
import 'package:mobile/features/packages/presentation/bloc/package_event.dart';
import 'package:mobile/features/packages/presentation/bloc/package_state.dart';

class HomePage extends StatefulWidget {
  final VoidCallback onFeedClick;

  const HomePage({super.key, required this.onFeedClick});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  bool showPackages = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color.fromRGBO(248, 247, 245, 1.0),
      floatingActionButton: PlanTripButton(onPressed: () {
        context.push('/plan-trip');
      }),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(14.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Header(),

              CategoryToggle(onFeedTap: widget.onFeedClick),
              const SizedBox(height: 24),

              if (showPackages) ...[
                const Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text("Top-Rated Packages",
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                    Text("See All",
                        style: TextStyle(color: AppColors.primaryOrange)),
                  ],
                ),
                const SizedBox(height: 16),

                // PACKAGES LIST — driven by PackageBloc
                BlocBuilder<PackageBloc, PackageState>(
                  builder: (context, state) {
                    if (state is PackageLoading) {
                      return const Center(child: CircularProgressIndicator(color: AppColors.primaryOrange));
                    }

                    if (state is PackageError) {
                      return Center(
                        child: Column(
                          children: [
                            Text(state.message, style: const TextStyle(color: Colors.red)),
                            const SizedBox(height: 8),
                            TextButton(
                              onPressed: () => context.read<PackageBloc>().add(
                                const LoadPackagesFeed(sortBy: 'rating_avg', order: 'desc'),
                              ),
                              child: const Text('Retry'),
                            ),
                          ],
                        ),
                      );
                    }

                    if (state is PackageFeedLoaded) {
                      if (state.packages.isEmpty) {
                        return const Center(
                          child: Padding(
                            padding: EdgeInsets.all(32),
                            child: Text('No packages available yet.',
                                style: TextStyle(color: Colors.grey)),
                          ),
                        );
                      }

                      final topPackages = state.packages.take(3).toList();
                      return Column(
                        children: List.generate(topPackages.length, (index) {
                          final pkg = topPackages[index];
                          return GestureDetector(
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => PackageDetailPage(
                                    packageId: pkg.id,
                                    title: pkg.title,
                                    location: pkg.location.isNotEmpty ? pkg.location : pkg.country,
                                    price: pkg.price.toStringAsFixed(0),
                                    rating: pkg.ratingAvg.toStringAsFixed(1),
                                    reviewsCount: pkg.reviewsCount.toString(),
                                    duration: '${pkg.durationDays} Days',
                                    groupType: pkg.groupSize.isNotEmpty ? pkg.groupSize : 'All Ages',
                                    category: pkg.category.isNotEmpty ? pkg.category : 'Travel',
                                    description: pkg.description.isNotEmpty ? pkg.description : pkg.summary,
                                    imageUrl: pkg.imageUrl,
                                  ),
                                ),
                              );
                            },
                            child: PackageCard(
                              imageUrl: pkg.imageUrl,
                              rating: pkg.ratingAvg,
                              title: pkg.title,
                              price: pkg.price.toStringAsFixed(0),
                              location: pkg.location.isNotEmpty ? pkg.location : pkg.country,
                              categoryName: pkg.category.isNotEmpty ? pkg.category : 'Travel',
                              categoryColor: Colors.orange,
                              duration: '${pkg.durationDays} Days',
                              targetAudience: pkg.groupSize.isNotEmpty ? pkg.groupSize : 'All Ages',
                              isBestSeller: index == 0,
                            ),
                          );
                        }),
                      );
                    }

                    // Initial / other states — show nothing
                    return const SizedBox.shrink();
                  },
                ),

                const SizedBox(height: 24),
                const CommunityCard(),
                const SizedBox(height: 100),
              ]
            ],
          ),
        ),
      ),
    );
  }
}
