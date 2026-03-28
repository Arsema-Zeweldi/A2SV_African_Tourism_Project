import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile/core/constants/app_colors.dart';
import 'package:mobile/features/market_place/presentation/pages/all_packages.dart';
import 'package:mobile/features/market_place/presentation/pages/chat_screen.dart';
import 'package:mobile/features/market_place/presentation/widgets/category_filter.dart';
import 'package:mobile/features/market_place/presentation/widgets/filter_button_sheet.dart';
import 'package:mobile/features/market_place/presentation/widgets/market_package_card.dart';
import 'package:mobile/features/market_place/presentation/widgets/market_place_header.dart';
import 'package:mobile/features/packages/presentation/bloc/package_bloc.dart';
import 'package:mobile/features/packages/presentation/bloc/package_event.dart';
import 'package:mobile/features/packages/presentation/bloc/package_state.dart';

class MarketPage extends StatefulWidget {
  const MarketPage({super.key});

  @override
  State<MarketPage> createState() => _MarketPageState();
}

class _MarketPageState extends State<MarketPage> {
  final TextEditingController _searchController = TextEditingController();
  String? _currentCategory;
  String? _currentQuery;
  Map<String, dynamic> _currentFilters = {};
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
    _loadPackages();
  }

  @override
  void dispose() {
    _searchController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _loadPackages() {
    context.read<PackageBloc>().add(LoadPackagesFeed(
      sortBy: _currentFilters['sort_by'] ?? 'rating_avg',
      order: _currentFilters['order'] ?? 'desc',
      query: _currentQuery,
      category: _currentCategory,

    ));
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
    _loadPackages();
  }

  void _onCategorySelected(String? category) {
    setState(() => _currentCategory = category);
    _loadPackages();
  }

  void _onFilterPressed() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => FilterBottomSheet(
        onApplyFilters: (filters) {
          setState(() {
            _currentFilters = filters;
          });
          _loadPackages();
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.scaffoldBackground,
      floatingActionButton: FloatingActionButton(
        onPressed: () => Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => const ChatScreen()),
        ),
        backgroundColor: const Color(0xFFF39233),
        child: const Icon(Icons.chat_bubble_outline, color: Colors.white),
      ),
      body: SafeArea(
        
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            children: [
              MarketPlaceHeader(
                searchController: _searchController,
                onFilterPressed: _onFilterPressed,
                onSearchSubmitted: _onSearch,
              ),
              const SizedBox(height: 16),
              CategoryFilter(onCategorySelected: _onCategorySelected),
              const SizedBox(height: 20),
              Expanded(
                child: SingleChildScrollView(
                  controller: _scrollController,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 12),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text(
                              "Curated Packages",
                              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                            ),
                            TextButton(
                              onPressed: () => Navigator.push(
                                context,
                                MaterialPageRoute(builder: (_) => const AllPackagesPage()),
                              ),
                              child: const Text("See all", style: TextStyle(color: Colors.orange)),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),
                      BlocBuilder<PackageBloc, PackageState>(
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
                                    onPressed: _loadPackages,
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
                                child: Center(child: Text('No packages found.', style: TextStyle(color: Colors.grey))),
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
              ),
            ],
          ),
        ),
      ),
    );
  }
}