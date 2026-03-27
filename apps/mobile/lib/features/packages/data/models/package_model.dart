import 'package:mobile/features/packages/domain/entities/package_entity.dart';

class ItineraryActivityModel extends ItineraryActivity {
  const ItineraryActivityModel({
    required super.id,
    required super.itineraryId,
    required super.dayNumber,
    required super.orderIndex,
    required super.title,
    required super.description,
    required super.timeLabel,
    required super.durationLabel,
    required super.costLabel,
    required super.location,
    required super.activityType,
    required super.imageUrl,
    required super.aiPick,
    required super.requirement,
    required super.latitude,
    required super.longitude,
    super.startTime,
    super.endTime,
  });

  factory ItineraryActivityModel.fromJson(Map<String, dynamic> json) {
    return ItineraryActivityModel(
      id: json['activity_id']?.toString() ?? '',
      itineraryId: json['itinerary_id']?.toString() ?? '',
      dayNumber: json['day_number'] ?? 0,
      orderIndex: json['order_index'] ?? 0,
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      timeLabel: json['time_label'] ?? '',
      durationLabel: json['duration_label'] ?? '',
      costLabel: json['cost_label'] ?? '',
      location: json['location'] ?? '',
      activityType: json['activity_type'] ?? '',
      imageUrl: json['image_url'] ?? '',
      aiPick: json['ai_pick'] ?? false,
      requirement: json['requirement'] ?? '',
      latitude: (json['latitude'] ?? 0).toDouble(),
      longitude: (json['longitude'] ?? 0).toDouble(),
      startTime: json['start_time'],
      endTime: json['end_time'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'activity_id': id,
      'itinerary_id': itineraryId,
      'day_number': dayNumber,
      'order_index': orderIndex,
      'title': title,
      'description': description,
      'time_label': timeLabel,
      'duration_label': durationLabel,
      'cost_label': costLabel,
      'location': location,
      'activity_type': activityType,
      'image_url': imageUrl,
      'ai_pick': aiPick,
      'requirement': requirement,
      'latitude': latitude,
      'longitude': longitude,
      'start_time': startTime,
      'end_time': endTime,
    };
  }
}

class ItineraryModel extends Itinerary {
  const ItineraryModel({
    required super.id,
    required super.userId,
    required super.title,
    required super.description,
    required super.daysCount,
    required super.nightsCount,
    super.startDate,
    super.endDate,
    required super.totalCostEst,
    required super.createdAt,
    required super.updatedAt,
    required super.activities,
  });

  factory ItineraryModel.fromJson(Map<String, dynamic> json) {
    final activitiesJson = json['activities'] as List? ?? [];
    return ItineraryModel(
      id: json['itinerary_id']?.toString() ?? '',
      userId: json['user_id']?.toString() ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      daysCount: json['days_count'] ?? 0,
      nightsCount: json['nights_count'] ?? 0,
      startDate: json['start_date'],
      endDate: json['end_date'],
      totalCostEst: (json['total_cost_est'] ?? 0).toDouble(),
      createdAt: _parseDate(json['created_at']),
      updatedAt: _parseDate(json['updated_at']),
      activities: activitiesJson
          .map((a) => ItineraryActivityModel.fromJson(a as Map<String, dynamic>))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'itinerary_id': id,
      'user_id': userId,
      'title': title,
      'description': description,
      'days_count': daysCount,
      'nights_count': nightsCount,
      'start_date': startDate,
      'end_date': endDate,
      'total_cost_est': totalCostEst,
    };
  }

  static DateTime _parseDate(dynamic value) {
    if (value == null) return DateTime.now();
    if (value is String) return DateTime.tryParse(value) ?? DateTime.now();
    return DateTime.now();
  }
}

class TravelPackageModel extends TravelPackage {
  const TravelPackageModel({
    required super.id,
    required super.creatorId,
    required super.itineraryId,
    required super.title,
    required super.summary,
    required super.description,
    required super.price,
    required super.status,
    required super.ratingAvg,
    required super.reviewsCount,
    required super.viewsCount,
    required super.country,
    required super.location,
    required super.currency,
    required super.imageUrl,
    required super.durationDays,
    required super.category,
    required super.groupSize,
    required super.createdAt,
    required super.updatedAt,
    super.itinerary,
  });

  factory TravelPackageModel.fromJson(Map<String, dynamic> json) {
    return TravelPackageModel(
      id: json['package_id']?.toString() ?? '',
      creatorId: json['creator_id']?.toString() ?? '',
      itineraryId: json['itinerary_id']?.toString() ?? '',
      title: json['title'] ?? '',
      summary: json['summary'] ?? '',
      description: json['description'] ?? '',
      price: (json['price'] ?? 0).toDouble(),
      status: json['status'] ?? 'private',
      ratingAvg: (json['rating_avg'] ?? 0).toDouble(),
      reviewsCount: json['reviews_count'] ?? 0,
      viewsCount: json['views_count'] ?? 0,
      country: json['country'] ?? '',
      location: json['location'] ?? '',
      currency: json['currency'] ?? 'USD',
      imageUrl: json['image_url'] ?? '',
      durationDays: json['duration_days'] ?? 0,
      category: json['category'] ?? '',
      groupSize: json['group_size'] ?? '',
      createdAt: _parseDate(json['created_at']),
      updatedAt: _parseDate(json['updated_at']),
      itinerary: json['itinerary'] != null
          ? ItineraryModel.fromJson(json['itinerary'] as Map<String, dynamic>)
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'package_id': id,
      'creator_id': creatorId,
      'itinerary_id': itineraryId,
      'title': title,
      'summary': summary,
      'description': description,
      'price': price,
      'status': status,
      'country': country,
      'location': location,
      'currency': currency,
      'image_url': imageUrl,
      'duration_days': durationDays,
      'category': category,
      'group_size': groupSize,
    };
  }

  static DateTime _parseDate(dynamic value) {
    if (value == null) return DateTime.now();
    if (value is String) return DateTime.tryParse(value) ?? DateTime.now();
    return DateTime.now();
  }
}

class PackageReviewModel extends PackageReview {
  const PackageReviewModel({
    required super.id,
    required super.packageId,
    required super.userId,
    required super.rating,
    required super.comment,
    required super.createdAt,
  });

  factory PackageReviewModel.fromJson(Map<String, dynamic> json) {
    return PackageReviewModel(
      id: json['review_id']?.toString() ?? '',
      packageId: json['package_id']?.toString() ?? '',
      userId: json['user_id']?.toString() ?? '',
      rating: (json['rating'] ?? 0).toDouble(),
      comment: json['comment'] ?? '',
      createdAt: _parseDate(json['created_at']),
    );
  }

  static DateTime _parseDate(dynamic value) {
    if (value == null) return DateTime.now();
    if (value is String) return DateTime.tryParse(value) ?? DateTime.now();
    return DateTime.now();
  }
}
