import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile/features/market_place/presentation/pages/package_detail_page.dart';
import 'package:mobile/features/packages/presentation/bloc/package_bloc.dart';
import 'package:mobile/features/packages/presentation/bloc/package_event.dart';
import 'package:mobile/features/packages/presentation/bloc/package_state.dart';
import 'package:mobile/features/home/presentation/widgets/package_card.dart';

class TopRatedPackagesPage extends StatefulWidget {
  const TopRatedPackagesPage({super.key});

  @override
  State<TopRatedPackagesPage> createState() => _TopRatedPackagesPageState();
}

class _TopRatedPackagesPageState extends State<TopRatedPackagesPage> {
  @override
  void initState() {
    super.initState();
    context.read<PackageBloc>().add(const LoadPackagesFeed(sortBy: 'rating_avg', order: 'desc'));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Top Rated Packages'),
        backgroundColor: Colors.white,
      ),
      body: BlocBuilder<PackageBloc, PackageState>(
        builder: (context, state) {
          if (state is PackageLoading) {
            return const Center(child: CircularProgressIndicator());
          }
          if (state is PackageError) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(state.message, style: const TextStyle(color: Colors.red)),
                  const SizedBox(height: 8),
                  ElevatedButton(
                    onPressed: () {
                      context.read<PackageBloc>().add(const LoadPackagesFeed(sortBy: 'rating_avg', order: 'desc'));
                    },
                    child: const Text('Retry'),
                  ),
                ],
              ),
            );
          }
          if (state is PackageFeedLoaded) {
            if (state.packages.isEmpty) {
              return const Center(child: Text('No packages found.'));
            }
            return ListView.builder(
              itemCount: state.packages.length,
              padding: const EdgeInsets.all(16),
              itemBuilder: (context, index) {
                final pkg = state.packages[index];
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
                    isBestSeller: false,
                  ),
                );
              },
            );
          }
          return const SizedBox.shrink();
        },
      ),
    );
  }
}