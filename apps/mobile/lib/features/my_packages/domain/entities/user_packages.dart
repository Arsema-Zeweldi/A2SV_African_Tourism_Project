enum PackageStatus { upcoming, completed }

class UserPackage {
  final String title;
  final String duration;
  final String dateRange;
  final String imagePath;
  final PackageStatus status;
  final bool isPublic;
  final double? rating;
  final String? imageUrl;

  UserPackage({
    required this.title,
    required this.duration,
    required this.dateRange,
    required this.imagePath,
    required this.status,
    required this.isPublic,
    this.rating,
    this.imageUrl,
  });
}