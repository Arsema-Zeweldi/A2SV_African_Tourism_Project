import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile/core/constants/app_colors.dart';
import 'package:mobile/features/market_place/presentation/widgets/category_filter.dart';
import 'package:mobile/features/market_place/presentation/widgets/market_package_card.dart';
import 'package:mobile/features/packages/presentation/bloc/package_bloc.dart';
import 'package:mobile/features/packages/presentation/bloc/package_event.dart';
import 'package:mobile/features/packages/presentation/bloc/package_state.dart';

class AllPackagesPage extends StatefulWidget {
  const AllPackagesPage({super.key});

  @override
  State<AllPackagesPage> createState() => _AllPackagesPageState();
}

class _AllPackagesPageState extends State<AllPackagesPage> {
  final TextEditingController _searchController = TextEditingController();
  String? _currentCategory;
  String? _currentQuery;
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
    context.read<PackageBloc>().add(const LoadPackagesFeed());
  }

  void _onScroll() {
    if (_scrollController.position.pixels >= _scrollController.position.maxScrollExtent - 200) {
      _loadMore();
    }
  }

  void _loadMore() {
    final state = context.read<PackageBloc>().state;
    if (state is PackageFeedLoaded && state.packages.length < state.total) {
      context.read<PackageBloc>().add(LoadPackagesFeed(
        sortBy: state.sortBy,
        order: state.order,
        query: state.query,
        category: state.category,
        page: state.page + 1,
      ));
    }
  }

  void _onSearch(String query) {
    setState(() => _currentQuery = query.isNotEmpty ? query : null);
    context.read<PackageBloc>().add(LoadPackagesFeed(
      query: _currentQuery,
      category: _currentCategory,
    ));
  }

  void _onCategorySelected(String? category) {
    setState(() => _currentCategory = category);
    context.read<PackageBloc>().add(LoadPackagesFeed(
      query: _currentQuery,
      category: _currentCategory,
    ));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('All Packages'),
        backgroundColor: AppColors.scaffoldBackground,
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(12),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search packages...',
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              ),
              onSubmitted: _onSearch,
            ),
          ),
          CategoryFilter(onCategorySelected: _onCategorySelected),
          const SizedBox(height: 12),
          Expanded(
            child: BlocBuilder<PackageBloc, PackageState>(
              builder: (context, state) {
                if (state is PackageLoading && state is! PackageFeedLoaded) {
                  return const Center(child: CircularProgressIndicator(color: AppColors.primaryOrange));
                }
                if (state is PackageError) {
                  return Center(
                    child: Column(
                      children: [
                        Text(state.message, style: const TextStyle(color: Colors.red)),
                        TextButton(
                          onPressed: () => _onSearch(_searchController.text),
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
                  return GridView.builder(
                    controller: _scrollController,
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      crossAxisSpacing: 16,
                      mainAxisSpacing: 16,
                      childAspectRatio: 0.65,
                    ),
                    itemCount: state.packages.length + (state.packages.length < state.total ? 1 : 0),
                    itemBuilder: (context, index) {
                      if (index == state.packages.length && state.packages.length < state.total) {
                        return const Center(child: CircularProgressIndicator());
                      }
                      final pkg = state.packages[index];
                      return MarketPackageCard(
                        packageId: pkg.id,
                        title: pkg.title,
                        price: pkg.price.toStringAsFixed(0),
                        imageUrl: pkg.imageUrl,
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
          ),
        ],
      ),
    );
  }
}