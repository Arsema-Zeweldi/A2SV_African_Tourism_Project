import 'package:flutter/material.dart';

class PackageDetailPage extends StatelessWidget {
  final String title;
  final String location;
  final String price;
  final String rating;
  final String reviewsCount;
  final String duration;
  final String groupType;
  final String category;
  final String description;
  final String imagePath;

  const PackageDetailPage({
    super.key,
    required this.title,
    required this.location,
    required this.price,
    required this.rating,
    required this.reviewsCount,
    required this.duration,
    required this.groupType,
    required this.category,
    required this.description,
    required this.imagePath,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Stack(
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
                    icon:
                        const Icon(Icons.favorite_border, color: Colors.white),
                  ),
                ],
                flexibleSpace: FlexibleSpaceBar(
                  background: Image.asset(
                    imagePath,
                    fit: BoxFit.cover,
                    width: double.infinity,
                  ),
                ),
              ),
              SliverToBoxAdapter(
                child: Container(
                  padding: const EdgeInsets.all(20),
                  color: Colors.white,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildHeaderSection(),
                      const SizedBox(height: 20),
                      _buildHighlightsSection(),
                      const SizedBox(height: 20),
                      _buildDescriptionSection(),
                      const SizedBox(height: 20),
                      _buildItinerarySection(),
                      const SizedBox(height: 100),
                    ],
                  ),
                ),
              ),
            ],
          ),
          Align(
            alignment: Alignment.bottomCenter,
            child: _buildBottomAction(context),
          ),
        ],
      ),
    );
  }

  Widget _buildHeaderSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            const Icon(Icons.star, color: Colors.orange, size: 18),
            const SizedBox(width: 4),
            Text("$rating ($reviewsCount Reviews)",
                style: const TextStyle(fontWeight: FontWeight.bold)),
          ],
        ),
        const SizedBox(height: 8),
        Text(
          title,
          style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8),
        Row(
          children: [
            Icon(Icons.location_on, color: Colors.grey[600], size: 16),
            Text(" $location", style: const TextStyle(color: Colors.grey)),
          ],
        ),
      ],
    );
  }

  Widget _buildHighlightsSection() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        _highlightItem('⌚', "DURATION", duration),
        _highlightItem('👥', "GROUP", groupType),
        _highlightItem('⛰️', "TYPE", category),
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

  Widget _buildDescriptionSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text("Description",
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        Text(
          description,
          style: const TextStyle(color: Colors.black87, height: 1.5),
        ),
        const SizedBox(height: 4),
        const Text("Read more",
            style:
                TextStyle(color: Colors.orange, fontWeight: FontWeight.bold)),
      ],
    );
  }

  Widget _buildItinerarySection() {
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
        _buildItineraryDay("Day 1: Arrival in Arusha",
            "Welcome to Tanzania. Airport pickup and transfer to your luxury boutique hotel for orientation and dinner."),
        const SizedBox(height: 16),
        _buildItineraryDay("Day 2–3: Central Serengeti",
            "First game drive in Seronera Valley. Spot big cats and the heart of the resident wildlife."),
        const SizedBox(height: 16),
        _buildItineraryDay("Day 4–7: Following the Migration", ""),
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

  Widget _buildBottomAction(BuildContext context) {
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
                Text("\$$price / person",
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
