import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:mobile/core/constants/app_colors.dart';

class ActivityMapView extends StatelessWidget {
  final List<MapActivity> activities;
  final double height;
  final bool interactive;
  final VoidCallback? onTap;

  const ActivityMapView({
    super.key,
    required this.activities,
    this.height = 300,
    this.interactive = true,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final validActivities = activities
        .where((a) => a.latitude != 0 && a.longitude != 0)
        .toList();

    if (validActivities.isEmpty) {
      return SizedBox(
        height: height,
        child: const Center(
          child: Text('No location data available',
              style: TextStyle(color: Colors.grey)),
        ),
      );
    }

    final center = _computeCenter(validActivities);
    final zoom = validActivities.length == 1 ? 13.0 : _computeZoom(validActivities);

    return GestureDetector(
      onTap: onTap,
      child: SizedBox(
        height: height,
        child: ClipRRect(
          borderRadius: BorderRadius.circular(12),
          child: FlutterMap(
            options: MapOptions(
              initialCenter: center,
              initialZoom: zoom,
              interactionOptions: InteractionOptions(
                flags: interactive
                    ? InteractiveFlag.all
                    : InteractiveFlag.none,
              ),
            ),
            children: [
              TileLayer(
                urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                userAgentPackageName: 'com.amona.mobile',
              ),
              MarkerLayer(
                markers: validActivities.map((a) {
                  return Marker(
                    point: LatLng(a.latitude, a.longitude),
                    width: 40,
                    height: 40,
                    child: GestureDetector(
                      onTap: () => _showActivityInfo(context, a),
                      child: const Icon(
                        Icons.location_on,
                        color: AppColors.primaryOrange,
                        size: 36,
                      ),
                    ),
                  );
                }).toList(),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showActivityInfo(BuildContext context, MapActivity activity) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (_) => Container(
        padding: const EdgeInsets.all(20),
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              activity.title,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: AppColors.primaryDark,
              ),
            ),
            if (activity.description.isNotEmpty) ...[
              const SizedBox(height: 8),
              Text(
                activity.description,
                style: const TextStyle(color: Colors.grey, height: 1.4),
              ),
            ],
            if (activity.location.isNotEmpty) ...[
              const SizedBox(height: 8),
              Row(
                children: [
                  const Icon(Icons.location_on, size: 16, color: Colors.grey),
                  const SizedBox(width: 4),
                  Text(activity.location,
                      style: const TextStyle(color: Colors.grey, fontSize: 13)),
                ],
              ),
            ],
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  LatLng _computeCenter(List<MapActivity> items) {
    double lat = 0, lng = 0;
    for (final a in items) {
      lat += a.latitude;
      lng += a.longitude;
    }
    return LatLng(lat / items.length, lng / items.length);
  }

  double _computeZoom(List<MapActivity> items) {
    double minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;
    for (final a in items) {
      if (a.latitude < minLat) minLat = a.latitude;
      if (a.latitude > maxLat) maxLat = a.latitude;
      if (a.longitude < minLng) minLng = a.longitude;
      if (a.longitude > maxLng) maxLng = a.longitude;
    }
    final latDiff = maxLat - minLat;
    final lngDiff = maxLng - minLng;
    final maxDiff = latDiff > lngDiff ? latDiff : lngDiff;

    if (maxDiff < 0.01) return 14.0;
    if (maxDiff < 0.05) return 12.0;
    if (maxDiff < 0.1) return 11.0;
    if (maxDiff < 0.5) return 9.0;
    if (maxDiff < 1.0) return 8.0;
    if (maxDiff < 5.0) return 6.0;
    return 4.0;
  }
}

class MapActivity {
  final String title;
  final String description;
  final String location;
  final double latitude;
  final double longitude;

  const MapActivity({
    required this.title,
    this.description = '',
    this.location = '',
    required this.latitude,
    required this.longitude,
  });
}
