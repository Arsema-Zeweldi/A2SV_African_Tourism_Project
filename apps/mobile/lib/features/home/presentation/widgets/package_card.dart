import 'package:flutter/material.dart';

class PackageCard extends StatelessWidget {
  final String? imagePath;
  final String? imageUrl;
  final double rating;
  final String categoryName;
  final Color categoryColor;
  final String duration;
  final String targetAudience;
  final String title;
  final String location;
  final String price;
  final bool isBestSeller;

  const PackageCard({
    super.key,
    this.imagePath,
    this.imageUrl,
    required this.rating,
    required this.categoryName,
    required this.categoryColor,
    required this.duration,
    required this.targetAudience,
    required this.title,
    required this.location,
    required this.price,
    required this.isBestSeller,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(30),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, 5),
            ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // IMAGE SECTION
          Stack(
            children: [
              ClipRRect(
                borderRadius: const BorderRadius.vertical(top: Radius.circular(30)),
                child: _buildImage(),
              ),

              // RATING BADGE
              Positioned(
                top: 15,
                right: 15,
                child: _buildBlurBadge(
                  child: Row(
                  children: [
                     const Icon(Icons.star, color: Colors.orange, size: 16),
                     const SizedBox(width: 4),
                    Text(
                      rating.toString(), style: const TextStyle(fontWeight: FontWeight.bold,))
                  ],
                  ),
                ),
              ),

              // BOTTOM BADGE
              Positioned(
                bottom: 15,
                left: 15,
                child: Row(
                  children: [
                    _buildTag(categoryName, categoryColor, Colors.white),
                    const SizedBox(width: 8),
                    _buildTag(duration, Colors.white.withValues(alpha: 0.9), Colors.black, icon: Icons.access_time),
                    const SizedBox(width: 8),
                    _buildTag(targetAudience, Colors.white.withValues(alpha: 0.9), Colors.black, icon: Icons.people_outline),
                  ],
                ),
              ),
            ]
          ),

          // DETAILS SECTION
          Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
              if (isBestSeller) _buildBestSellerBadge(),
              const SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Text(
                      title,
                      style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800, height: 1.2),
                    ),
                  ),

                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      const Text("Starts at", style: TextStyle(color: Colors.grey, fontSize: 12 )),
                      Text("\$$price", style: const TextStyle(color: Color(0xFFF39233), fontSize: 20, fontWeight: FontWeight.bold)
                      ),
                      ],
                  ),
                ],
              ),
              const SizedBox(height: 10),
              Row(
              children: [ 
              const Icon(Icons.location_on_outlined, color: Colors.grey, size: 16), 
              const SizedBox(width: 4), 
              Text(location, style: TextStyle(color: Colors.blueGrey[400]))
              ],
              )
              ],
            )
          )
        ],
      )
    );
  }

  Widget _buildBlurBadge({required Widget child}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.9),
        borderRadius: BorderRadius.circular(20),
      ),
      child: child,
    );
  }

  Widget _buildTag(String label, Color bgColor, Color textColor, {IconData? icon}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(color: bgColor, borderRadius: BorderRadius.circular(20)),
      child: Row(
        children: [
          if (icon != null) ...[Icon(icon, size: 14, color: textColor), const SizedBox(width: 4)],
          Text(label.toUpperCase(), style: TextStyle(color: textColor, fontSize: 10, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _buildImage() {
    if (imageUrl != null && imageUrl!.isNotEmpty) {
      return Image.network(
        imageUrl!,
        height: 200,
        width: double.infinity,
        fit: BoxFit.cover,
        errorBuilder: (_, __, ___) => Container(
          height: 200,
          color: Colors.grey[200],
          child: const Icon(Icons.image, size: 48, color: Colors.grey),
        ),
      );
    }
    return Image.asset(
      imagePath ?? 'assets/images/top_rated1.png',
      height: 200,
      width: double.infinity,
      fit: BoxFit.cover,
    );
  }

  Widget _buildBestSellerBadge() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(color: const Color(0xFFFFF3E0), borderRadius: BorderRadius.circular(5)),
      child: const Text("BEST SELLER", style: TextStyle(color: Colors.orange, fontSize: 10, fontWeight: FontWeight.bold)),
    );
  }
}
