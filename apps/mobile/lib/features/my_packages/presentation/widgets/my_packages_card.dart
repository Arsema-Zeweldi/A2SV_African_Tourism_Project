import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/features/packages/domain/entities/package_entity.dart';
import 'package:mobile/features/packages/presentation/bloc/package_bloc.dart';
import 'package:mobile/features/packages/presentation/bloc/package_event.dart';

class MyPackagesCard extends StatelessWidget {
  final TravelPackage package;
  const MyPackagesCard({super.key, required this.package});

  @override
  Widget build(BuildContext context) {
    final isPublic = package.status == 'public';
    final isCompleted = package.status == 'archived';
    final statusText = isCompleted ? "COMPLETED" : "UPCOMING";
    final statusColor = isCompleted ? Colors.blueGrey : Colors.orange;

    return GestureDetector(
      onTap: () {
        context.push('/package-detail', extra: package);
      },
      child: Container(
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
              child: package.imageUrl.isNotEmpty
                  ? Image.network(
                      package.imageUrl,
                      width: 100,
                      height: 100,
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => Image.asset(
                        'assets/images/top_rated1.png',
                        width: 100,
                        height: 100,
                        fit: BoxFit.cover,
                      ),
                    )
                  : Image.asset('assets/images/top_rated1.png',
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
                        statusText,
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          color: statusColor,
                        ),
                      ),
                      Icon(isPublic ? Icons.public : Icons.lock_outline,
                          size: 16, color: Colors.grey),
                    ],
                  ),
                  Text(package.title,
                      style: const TextStyle(
                          fontSize: 18, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      const Icon(Icons.access_time,
                          size: 14, color: Colors.grey),
                      Text(" ${package.durationDays} Days",
                          style: const TextStyle(
                              color: Colors.grey, fontSize: 12)),
                    ],
                  ),
                  Text(
                    isCompleted ? 'Completed' : package.status.toUpperCase(),
                    style: const TextStyle(color: Colors.grey, fontSize: 12),
                  ),
                  if (isCompleted && package.ratingAvg > 0)
                    Row(
                      children: List.generate(
                        5,
                        (index) => Icon(
                          index < package.ratingAvg.floor()
                              ? Icons.star
                              : Icons.star_border,
                          size: 14,
                          color: Colors.orange,
                        ),
                      ),
                    ),
                ],
              ),
            ),
            Transform.scale(
              scale: 0.7,
              child: Switch(
                value: isPublic,
                onChanged: (val) {
                  final newStatus = val ? 'public' : 'private';
                  context.read<PackageBloc>().add(UpdatePackageStatus(
                        packageId: package.id,
                        status: newStatus,
                      ));
                },
                activeThumbColor: Colors.orange,
                activeTrackColor: Colors.orange.withValues(alpha: 0.5),
                inactiveThumbColor: Colors.grey,
                inactiveTrackColor: Colors.grey.withValues(alpha: 0.5),
              ),
            )
          ],
        ),
      ),
    );
  }
}
