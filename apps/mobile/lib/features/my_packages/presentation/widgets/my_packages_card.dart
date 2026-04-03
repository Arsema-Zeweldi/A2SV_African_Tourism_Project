import 'package:flutter/material.dart';
import 'package:mobile/features/my_packages/domain/entities/user_packages.dart';

class MyPackagesCard extends StatelessWidget {
  final UserPackage package;
  const MyPackagesCard({super.key, required this.package});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFF1F3F5)),
      ),
      child: Row(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: package.imageUrl != null && package.imageUrl!.isNotEmpty
                ? Image.network(
                    package.imageUrl!,
                    width: 100,
                    height: 100,
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => Image.asset(
                      package.imagePath,
                      width: 100,
                      height: 100,
                      fit: BoxFit.cover,
                    ),
                  )
                : Image.asset(package.imagePath,
                    width: 100, height: 100, fit: BoxFit.cover),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      package.status == PackageStatus.upcoming
                          ? "UPCOMING"
                          : "COMPLETED",
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: package.status == PackageStatus.upcoming
                            ? Colors.orange
                            : Colors.blueGrey,
                      ),
                    ),
                    Icon(package.isPublic ? Icons.public : Icons.lock_outline,
                        size: 16, color: Colors.grey),
                  ],
                ),
                Text(package.title,
                    style: const TextStyle(
                        fontSize: 18, fontWeight: FontWeight.bold)),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Icon(Icons.access_time, size: 14, color: Colors.grey),
                    Text(" ${package.duration}",
                        style:
                            const TextStyle(color: Colors.grey, fontSize: 12)),
                  ],
                ),
                Text(package.dateRange,
                    style: const TextStyle(color: Colors.grey, fontSize: 12)),
                if (package.status == PackageStatus.completed)
                  Row(
                    children: List.generate(
                        5,
                        (index) => const Icon(Icons.star,
                            size: 14, color: Colors.orange)),
                  ),
              ],
            ),
          ),
          Transform.scale(
            scale: 0.7,
            child: Switch(
              value: package.isPublic,
              onChanged: (val) {},
              activeThumbColor: Colors.orange,
              activeTrackColor: Colors.orange.withValues(alpha: 0.5),
              inactiveThumbColor: Colors.grey,
              inactiveTrackColor: Colors.grey.withValues(alpha: 0.5),
            ),
          )
        ],
      ),
    );
  }
}
