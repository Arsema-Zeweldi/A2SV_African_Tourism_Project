import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile/core/constants/app_colors.dart';
import 'package:mobile/features/market_place/presentation/widgets/category_filter.dart';
import 'package:mobile/features/market_place/presentation/widgets/market_package_card.dart';
import 'package:mobile/features/market_place/presentation/widgets/market_place_header.dart';
import 'package:mobile/features/packages/presentation/bloc/package_bloc.dart';
import 'package:mobile/features/packages/presentation/bloc/package_event.dart';
import 'package:mobile/features/packages/presentation/bloc/package_state.dart';

class MarketPage extends StatelessWidget {
  const MarketPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.scaffoldBackground,
      floatingActionButton: Container(
        height: 60,
        width: 60,
        decoration: BoxDecoration(
          color: const Color(0xFFF39233),
          shape: BoxShape.circle,
          boxShadow: [
            BoxShadow(
                color: Colors.orange.withValues(alpha: 0.3),
                blurRadius: 10,
                offset: const Offset(0, 5))
          ],
        ),
        child: const Icon(Icons.chat_bubble_outline, color: Colors.white),
      ),
      body: SafeArea(
          child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: SingleChildScrollView(
          child: Column(
            children: [
              const MarketPlaceHeader(),
              const SizedBox(height: 16),
              CategoryFilter(),
              const SizedBox(
                height: 20,
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    "Curated Packages",
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  TextButton(
                    onPressed: () {},
                    child: const Text("See all",
                        style: TextStyle(color: Colors.orange)),
                  ),
                ],
              ),

              // PACKAGE CARDS — driven by PackageBloc
              BlocBuilder<PackageBloc, PackageState>(
                builder: (context, state) {
                  if (state is PackageLoading) {
                    return const Padding(
                      padding: EdgeInsets.all(32),
                      child: Center(child: CircularProgressIndicator(color: AppColors.primaryOrange)),
                    );
                  }

                  if (state is PackageError) {
                    return Center(
                      child: Column(
                        children: [
                          Text(state.message, style: const TextStyle(color: Colors.red)),
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
                      return const Padding(
                        padding: EdgeInsets.all(32),
                        child: Center(child: Text('No packages available yet.', style: TextStyle(color: Colors.grey))),
                      );
                    }

                    return GridView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        crossAxisSpacing: 16,
                        mainAxisSpacing: 16,
                        childAspectRatio: 0.65,
                      ),
                      itemCount: state.packages.length,
                      itemBuilder: (context, index) {
                        final pkg = state.packages[index];
                        return MarketPackageCard(
                          packageId: pkg.id,
                          title: pkg.title,
                          price: pkg.price.toStringAsFixed(0),
                          imageUrl: pkg.imageUrl,
                          label: index < 3 ? 'TOP RATED' : null,
                          rating: pkg.ratingAvg.toStringAsFixed(1),
                          duration: '${pkg.durationDays} Days',
                          location: pkg.location.isNotEmpty ? pkg.location : pkg.country,
                          description: pkg.description.isNotEmpty ? pkg.description : pkg.summary,
                          reviewsCount: pkg.reviewsCount.toString(),
                          groupType: pkg.groupSize.isNotEmpty ? pkg.groupSize : 'All Ages',
                          category: pkg.category.isNotEmpty ? pkg.category : 'Travel',
                        );
                      },
                    );
                  }

                  return const SizedBox.shrink();
                },
              ),
              const SizedBox(height: 80),
            ],
          ),
        ),
      )),
    );
  }
}
