import 'package:flutter/material.dart';
import 'package:mobile/features/marketPlace/presentation/pages/package_detail_page.dart';

class MarketPackageCard extends StatelessWidget {
  final String title, price, image, rating, duration;
  final String? label;

  const MarketPackageCard({
    super.key,
    required this.title,
    required this.price,
    required this.image,
    required this.rating,
    required this.duration,
    this.label,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () {
        Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => const PackageDetailPage(
                title: "Serengeti Great Migration Safari",
                location: "Serengeti National Park, Tanzania",
                price: "2,450",
                rating: "4.9",
                reviewsCount: "124",
                duration: "7 Days",
                groupType: "EVERYONE",
                category: "SAFARI",
                imagePath: 'assets/images/top_rated3.png',
                description: "Witness the earth's greatest spectacle...",
              ),
            ));
      },
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Stack(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(25),
                child: Image.asset(image,
                    height: 160, width: double.infinity, fit: BoxFit.cover),
              ),
              const Positioned(
                  top: 12,
                  right: 12,
                  child: Icon(Icons.favorite_border, color: Colors.white)),
              if (label != null)
                Positioned(
                  bottom: 12,
                  left: 12,
                  child: Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.9),
                        borderRadius: BorderRadius.circular(8)),
                    child: Text(label!,
                        style: const TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: Colors.orange)),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 8),
          Text(title,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
              maxLines: 2),
          Text("$duration • ★ $rating",
              style: const TextStyle(color: Colors.grey, fontSize: 12)),
          Text("\$$price",
              style: const TextStyle(
                  color: Colors.orange,
                  fontWeight: FontWeight.bold,
                  fontSize: 16)),
          const Text("/person",
              style: TextStyle(color: Colors.grey, fontSize: 10)),
        ],
      ),
    );
  }
}
