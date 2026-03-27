import 'package:equatable/equatable.dart';

class ItineraryActivity extends Equatable {
  final String id;
  final String itineraryId;
  final int dayNumber;
  final int orderIndex;
  final String title;
  final String description;
  final String timeLabel;
  final String durationLabel;
  final String costLabel;
  final String location;
  final String activityType;
  final String imageUrl;
  final bool aiPick;
  final String requirement;
  final double latitude;
  final double longitude;
  final String? startTime;
  final String? endTime;

  const ItineraryActivity({
    required this.id,
    required this.itineraryId,
    required this.dayNumber,
    required this.orderIndex,
    required this.title,
    required this.description,
    required this.timeLabel,
    required this.durationLabel,
    required this.costLabel,
    required this.location,
    required this.activityType,
    required this.imageUrl,
    required this.aiPick,
    required this.requirement,
    required this.latitude,
    required this.longitude,
    this.startTime,
    this.endTime,
  });

  @override
  List<Object?> get props => [id];
}

class Itinerary extends Equatable {
  final String id;
  final String userId;
  final String title;
  final String description;
  final int daysCount;
  final int nightsCount;
  final String? startDate;
  final String? endDate;
  final double totalCostEst;
  final DateTime createdAt;
  final DateTime updatedAt;
  final List<ItineraryActivity> activities;

  const Itinerary({
    required this.id,
    required this.userId,
    required this.title,
    required this.description,
    required this.daysCount,
    required this.nightsCount,
    this.startDate,
    this.endDate,
    required this.totalCostEst,
    required this.createdAt,
    required this.updatedAt,
    required this.activities,
  });

  @override
  List<Object?> get props => [id];
}

class TravelPackage extends Equatable {
  final String id;
  final String creatorId;
  final String itineraryId;
  final String title;
  final String summary;
  final String description;
  final double price;
  final String status;
  final double ratingAvg;
  final int reviewsCount;
  final int viewsCount;
  final String country;
  final String location;
  final String currency;
  final String imageUrl;
  final int durationDays;
  final String category;
  final String groupSize;
  final DateTime createdAt;
  final DateTime updatedAt;
  final Itinerary? itinerary;

  const TravelPackage({
    required this.id,
    required this.creatorId,
    required this.itineraryId,
    required this.title,
    required this.summary,
    required this.description,
    required this.price,
    required this.status,
    required this.ratingAvg,
    required this.reviewsCount,
    required this.viewsCount,
    required this.country,
    required this.location,
    required this.currency,
    required this.imageUrl,
    required this.durationDays,
    required this.category,
    required this.groupSize,
    required this.createdAt,
    required this.updatedAt,
    this.itinerary,
  });

  @override
  List<Object?> get props => [id];
}

class PackageReview extends Equatable {
  final String id;
  final String packageId;
  final String userId;
  final double rating;
  final String comment;
  final DateTime createdAt;

  const PackageReview({
    required this.id,
    required this.packageId,
    required this.userId,
    required this.rating,
    required this.comment,
    required this.createdAt,
  });

  @override
  List<Object?> get props => [id];
}

class PaginatedPackages {
  final List<TravelPackage> packages;
  final int total;
  final int page;
  final int pageSize;

  const PaginatedPackages({
    required this.packages,
    required this.total,
    required this.page,
    required this.pageSize,
  });
}
