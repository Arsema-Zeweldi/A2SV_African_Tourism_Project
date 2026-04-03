import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/core/widgets/activity_map.dart';
import 'package:mobile/features/packages/presentation/bloc/package_bloc.dart';
import 'package:mobile/features/packages/presentation/bloc/package_event.dart';
import 'package:mobile/features/packages/presentation/bloc/package_state.dart';

class PackageDetailPage extends StatefulWidget {
  final String? packageId;
  final String title;
  final String location;
  final String price;
  final String rating;
  final String reviewsCount;
  final String duration;
  final String groupType;
  final String category;
  final String description;
  final String? imagePath;
  final String? imageUrl;

  const PackageDetailPage({
    super.key,
    this.packageId,
    required this.title,
    required this.location,
    required this.price,
    required this.rating,
    required this.reviewsCount,
    required this.duration,
    required this.groupType,
    required this.category,
    required this.description,
    this.imagePath,
    this.imageUrl,
  });

  @override
  State<PackageDetailPage> createState() => _PackageDetailPageState();
}

class _PackageDetailPageState extends State<PackageDetailPage> {
  @override
  void initState() {
    super.initState();
    if (widget.packageId != null) {
      context.read<PackageBloc>().add(LoadPackageDetail(widget.packageId!));
    }
  }

  Widget _buildHeroImage(String? url, String? assetPath) {
    if (url != null && url.isNotEmpty) {
      return Image.network(
        url,
        fit: BoxFit.cover,
        width: double.infinity,
        errorBuilder: (_, __, ___) => Container(
          color: Colors.grey[200],
          child: const Icon(Icons.image, size: 64, color: Colors.grey),
        ),
      );
    }
    if (assetPath != null && assetPath.isNotEmpty) {
      return Image.asset(assetPath, fit: BoxFit.cover, width: double.infinity);
    }
    return Container(
      color: Colors.grey[200],
      child: const Icon(Icons.image, size: 64, color: Colors.grey),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: BlocBuilder<PackageBloc, PackageState>(
        buildWhen: (prev, curr) => curr is PackageDetailLoaded || curr is PackageLoading || curr is PackageError,
        builder: (context, state) {
          // Use loaded detail data if available, otherwise fall back to constructor props
          String displayTitle = widget.title;
          String displayLocation = widget.location;
          String displayPrice = widget.price;
          String displayRating = widget.rating;
          String displayReviewsCount = widget.reviewsCount;
          String displayDuration = widget.duration;
          String displayGroupType = widget.groupType;
          String displayCategory = widget.category;
          String displayDescription = widget.description;
          String? displayImageUrl = widget.imageUrl;
          String? displayImagePath = widget.imagePath;
          List<_ItineraryDay> itineraryDays = [];
          List<MapActivity> mapActivities = [];

          if (state is PackageDetailLoaded) {
            final pkg = state.package;
            displayTitle = pkg.title;
            displayLocation = pkg.location.isNotEmpty ? pkg.location : pkg.country;
            displayPrice = pkg.price.toStringAsFixed(0);
            displayRating = pkg.ratingAvg.toStringAsFixed(1);
            displayReviewsCount = pkg.reviewsCount.toString();
            displayDuration = '${pkg.durationDays} Days';
            displayGroupType = pkg.groupSize.isNotEmpty ? pkg.groupSize : 'All Ages';
            displayCategory = pkg.category.isNotEmpty ? pkg.category : 'Travel';
            displayDescription = pkg.description.isNotEmpty ? pkg.description : pkg.summary;
            displayImageUrl = pkg.imageUrl;

            // Build itinerary from real data
            if (pkg.itinerary != null) {
              final activitiesByDay = <int, List<String>>{};
              for (final a in pkg.itinerary!.activities) {
                activitiesByDay.putIfAbsent(a.dayNumber, () => []);
                activitiesByDay[a.dayNumber]!.add(a.title + (a.description.isNotEmpty ? ': ${a.description}' : ''));
              }
              final sortedDays = activitiesByDay.keys.toList()..sort();
              itineraryDays = sortedDays.map((d) => _ItineraryDay(
                title: 'Day $d',
                description: activitiesByDay[d]!.join('\n'),
              )).toList();

              mapActivities = pkg.itinerary!.activities
                  .where((a) => a.latitude != 0 && a.longitude != 0)
                  .map((a) => MapActivity(
                        title: a.title,
                        description: a.description,
                        location: a.location,
                        latitude: a.latitude,
                        longitude: a.longitude,
                      ))
                  .toList();
            }
          }

          return Stack(
            children: [
              CustomScrollView(
                slivers: [
                  SliverAppBar(
                    expandedHeight: 400,
                    pinned: true,
                    leading: const BackButton(color: Colors.white),
                    actions: [
                      IconButton(
                        onPressed: () {},
                        icon: const Icon(Icons.share, color: Colors.white),
                      ),
                      IconButton(
                        onPressed: () {},
                        icon: const Icon(Icons.favorite_border, color: Colors.white),
                      ),
                    ],
                    flexibleSpace: FlexibleSpaceBar(
                      background: _buildHeroImage(displayImageUrl, displayImagePath),
                    ),
                  ),
                  SliverToBoxAdapter(
                    child: Container(
                      padding: const EdgeInsets.all(20),
                      color: Colors.white,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          _buildHeaderSection(displayTitle, displayLocation, displayRating, displayReviewsCount),
                          const SizedBox(height: 20),
                          _buildHighlightsSection(displayDuration, displayGroupType, displayCategory),
                          const SizedBox(height: 20),
                          _buildDescriptionSection(displayDescription),
                          const SizedBox(height: 20),
                          _buildItinerarySection(itineraryDays),
                          if (mapActivities.isNotEmpty) ...[
                            const SizedBox(height: 20),
                            _buildMapSection(context, mapActivities),
                          ],
                          const SizedBox(height: 100),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
              Align(
                alignment: Alignment.bottomCenter,
                child: _buildBottomAction(context, displayPrice),
              ),
              if (widget.packageId != null)
                Positioned(
                  right: 16,
                  bottom: 90,
                  child: FloatingActionButton(
                    heroTag: 'chat_fab',
                    onPressed: () => context.push(
                      '/package-chat/${widget.packageId}',
                      extra: displayTitle,
                    ),
                    backgroundColor: Colors.orange,
                    child: const Icon(Icons.chat_bubble_outline, color: Colors.white),
                  ),
                ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildHeaderSection(String displayTitle, String displayLocation, String displayRating, String displayReviewsCount) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            const Icon(Icons.star, color: Colors.orange, size: 18),
            const SizedBox(width: 4),
            Text("$displayRating ($displayReviewsCount Reviews)",
                style: const TextStyle(fontWeight: FontWeight.bold)),
          ],
        ),
        const SizedBox(height: 8),
        Text(
          displayTitle,
          style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8),
        Row(
          children: [
            Icon(Icons.location_on, color: Colors.grey[600], size: 16),
            Text(" $displayLocation", style: const TextStyle(color: Colors.grey)),
          ],
        ),
      ],
    );
  }

  Widget _buildHighlightsSection(String displayDuration, String displayGroupType, String displayCategory) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        _highlightItem('⌚', "DURATION", displayDuration),
        _highlightItem('👥', "GROUP", displayGroupType),
        _highlightItem('⛰️', "TYPE", displayCategory),
      ],
    );
  }

  Widget _highlightItem(String emoji, String label, String value) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFFFFF7F0),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          Text(emoji, style: const TextStyle(fontSize: 20)),
          const SizedBox(height: 4),
          Text(label, style: const TextStyle(fontSize: 10, color: Colors.grey)),
          Text(value,
              style:
                  const TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
        ],
      ),
    );
  }

  Widget _buildDescriptionSection(String displayDescription) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text("Description",
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        Text(
          displayDescription,
          style: const TextStyle(color: Colors.black87, height: 1.5),
        ),
        const SizedBox(height: 4),
        const Text("Read more",
            style:
                TextStyle(color: Colors.orange, fontWeight: FontWeight.bold)),
      ],
    );
  }

  Widget _buildItinerarySection(List<_ItineraryDay> itineraryDays) {
    // Fall back to placeholder if no real itinerary data
    final days = itineraryDays.isNotEmpty
        ? itineraryDays
        : [
            const _ItineraryDay(title: "Day 1: Arrival", description: "Welcome! Airport pickup and transfer to your hotel for orientation and dinner."),
            const _ItineraryDay(title: "Day 2–3: Exploration", description: "Guided tours and activities based on your itinerary."),
            const _ItineraryDay(title: "Day 4+: Adventure Continues", description: ""),
          ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text("Itinerary",
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            Text("COLLAPSE ALL",
                style: TextStyle(color: Colors.orange, fontSize: 12)),
          ],
        ),
        const SizedBox(height: 16),
        ...days.map((day) => Padding(
          padding: const EdgeInsets.only(bottom: 16),
          child: _buildItineraryDay(day.title, day.description),
        )),
        const SizedBox(height: 8),
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Colors.grey[50],
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: Colors.grey[200]!),
          ),
          child: const Text(
            "Disclaimer: We facilitate itineraries generation and community connection via package chats. We do not provide on-ground staff or tour guides. All on-site services are managed by third-party travel agents and guides.",
            style: TextStyle(color: Colors.grey, fontSize: 12, height: 1.4),
          ),
        ),
      ],
    );
  }

  Widget _buildItineraryDay(String title, String description) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 2,
          height: 50,
          color: Colors.orange,
          margin: const EdgeInsets.only(right: 12),
        ),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title,
                  style: const TextStyle(
                      fontWeight: FontWeight.bold, fontSize: 16)),
              if (description.isNotEmpty) ...[
                const SizedBox(height: 4),
                Text(description,
                    style: TextStyle(color: Colors.grey[600], fontSize: 14)),
              ],
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildMapSection(BuildContext context, List<MapActivity> activities) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text("Map",
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        const SizedBox(height: 12),
        ActivityMapView(
          activities: activities,
          height: 200,
          interactive: false,
          onTap: () {
            Navigator.of(context).push(
              MaterialPageRoute(
                builder: (_) => Scaffold(
                  appBar: AppBar(
                    title: const Text('Activity Locations'),
                    backgroundColor: Colors.white,
                    foregroundColor: Colors.black,
                    elevation: 1,
                  ),
                  body: ActivityMapView(
                    activities: activities,
                    height: double.infinity,
                  ),
                ),
              ),
            );
          },
        ),
        const SizedBox(height: 4),
        const Center(
          child: Text('Tap to expand',
              style: TextStyle(color: Colors.grey, fontSize: 12)),
        ),
      ],
    );
  }

  Widget _buildBottomAction(BuildContext context, String displayPrice) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 15),
      decoration: const BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
              color: Colors.black12, blurRadius: 10, offset: Offset(0, -5))
        ],
      ),
      child: SafeArea(
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text("TOTAL PRICE",
                    style: TextStyle(fontSize: 10, color: Colors.grey)),
                Text("\$$displayPrice / person",
                    style: const TextStyle(
                        fontSize: 20, fontWeight: FontWeight.bold)),
              ],
            ),
            ElevatedButton(
              onPressed: () {},
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.orange,
                padding:
                    const EdgeInsets.symmetric(horizontal: 40, vertical: 15),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(15)),
              ),
              child: const Text("Use Package",
                  style: TextStyle(
                      color: Colors.white, fontWeight: FontWeight.bold)),
            ),
          ],
        ),
      ),
    );
  }
}

class _ItineraryDay {
  final String title;
  final String description;
  const _ItineraryDay({required this.title, required this.description});
}
