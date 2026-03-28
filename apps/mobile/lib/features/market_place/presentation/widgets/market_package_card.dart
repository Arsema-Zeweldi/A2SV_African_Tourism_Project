import 'package:flutter/material.dart';
import 'package:mobile/features/market_place/presentation/pages/package_detail_page.dart';

class MarketPackageCard extends StatelessWidget {
  final String? packageId;
  final String title, price, rating, duration;
  final String? image;
  final String? imageUrl;
  final String? label;
  final String? location;
  final String? description;
  final String? reviewsCount;
  final String? groupType;
  final String? category;

  const MarketPackageCard({
    super.key,
    this.packageId,
    required this.title,
    required this.price,
    this.image,
    this.imageUrl,
    required this.rating,
    required this.duration,
    this.label,
    this.location,
    this.description,
    this.reviewsCount,
    this.groupType,
    this.category,
  });

  Widget _buildCardImage() {
    if (imageUrl != null && imageUrl!.isNotEmpty) {
      return Image.network(
        imageUrl!,
        height: 160,
        width: double.infinity,
        fit: BoxFit.cover,
        errorBuilder: (_, __, ___) => Container(
          height: 160,
          color: Colors.grey[200],
          child: const Icon(Icons.image, size: 32, color: Colors.grey),
        ),
      );
    }
    return Image.asset(
      image ?? 'assets/images/top_rated1.png',
      height: 160,
      width: double.infinity,
      fit: BoxFit.cover,
    );
  }

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () {
        Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => PackageDetailPage(
                packageId: packageId,
                title: title,
                location: location ?? '',
                price: price,
                rating: rating,
                reviewsCount: reviewsCount ?? '0',
                duration: duration,
                groupType: groupType ?? 'All Ages',
                category: category ?? 'Travel',
                imageUrl: imageUrl,
                imagePath: image,
                description: description ?? '',
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
                child: _buildCardImage(),
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
