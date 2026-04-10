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

  factory ItineraryActivity.fromJson(Map<String, dynamic> json) {
    return ItineraryActivity(
      id: json['id'] as String? ?? '',
      itineraryId: json['itineraryId'] ?? json['itinerary_id'] as String? ?? '',
      dayNumber: json['dayNumber'] ?? json['day_number'] as int? ?? 0,
      orderIndex: json['orderIndex'] ?? json['order_index'] as int? ?? 0,
      title: json['title'] as String? ?? '',
      description: json['description'] as String? ?? '',
      timeLabel: json['timeLabel'] ?? json['time_label'] as String? ?? '',
      durationLabel:
          json['durationLabel'] ?? json['duration_label'] as String? ?? '',
      costLabel: json['costLabel'] ?? json['cost_label'] as String? ?? '',
      location: json['location'] as String? ?? '',
      activityType:
          json['activityType'] ?? json['activity_type'] as String? ?? '',
      imageUrl: json['imageUrl'] ?? json['image_url'] as String? ?? '',
      aiPick: json['aiPick'] ?? json['ai_pick'] as bool? ?? false,
      requirement: json['requirement'] as String? ?? '',
      latitude: (json['latitude'] as num?)?.toDouble() ?? 0.0,
      longitude: (json['longitude'] as num?)?.toDouble() ?? 0.0,
      startTime: json['startTime'] ?? json['start_time'] as String?,
      endTime: json['endTime'] ?? json['end_time'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'itineraryId': itineraryId,
      'dayNumber': dayNumber,
      'orderIndex': orderIndex,
      'title': title,
      'description': description,
      'timeLabel': timeLabel,
      'durationLabel': durationLabel,
      'costLabel': costLabel,
      'location': location,
      'activityType': activityType,
      'imageUrl': imageUrl,
      'aiPick': aiPick,
      'requirement': requirement,
      'latitude': latitude,
      'longitude': longitude,
      'startTime': startTime,
      'endTime': endTime,
    };
  }

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

  Itinerary copyWith({
    String? id,
    String? userId,
    String? title,
    String? description,
    int? daysCount,
    int? nightsCount,
    String? startDate,
    String? endDate,
    double? totalCostEst,
    DateTime? createdAt,
    DateTime? updatedAt,
    List<ItineraryActivity>? activities,
  }) {
    return Itinerary(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      title: title ?? this.title,
      description: description ?? this.description,
      daysCount: daysCount ?? this.daysCount,
      nightsCount: nightsCount ?? this.nightsCount,
      startDate: startDate ?? this.startDate,
      endDate: endDate ?? this.endDate,
      totalCostEst: totalCostEst ?? this.totalCostEst,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      activities: activities ?? this.activities,
    );
  }

  factory Itinerary.fromJson(Map<String, dynamic> json) {
    final activitiesList = json['activities'] as List? ?? [];
    return Itinerary(
      id: json['id'] as String? ?? json['itinerary_id'] as String? ?? '',
      userId: json['userId'] ?? json['user_id'] as String? ?? '',
      title: json['title'] as String? ?? '',
      description: json['description'] as String? ?? '',
      daysCount: json['daysCount'] ?? json['days_count'] as int? ?? 0,
      nightsCount: json['nightsCount'] ?? json['nights_count'] as int? ?? 0,
      startDate: json['startDate'] ?? json['start_date'] as String?,
      endDate: json['endDate'] ?? json['end_date'] as String?,
      totalCostEst: (json['totalCostEst'] ?? json['total_cost_est'] as num?)
              ?.toDouble() ??
          0.0,
      createdAt:
          DateTime.parse(json['createdAt'] ?? json['created_at'] as String),
      updatedAt:
          DateTime.parse(json['updatedAt'] ?? json['updated_at'] as String),
      activities:
          activitiesList.map((a) => ItineraryActivity.fromJson(a)).toList(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'title': title,
      'description': description,
      'daysCount': daysCount,
      'nightsCount': nightsCount,
      'startDate': startDate,
      'endDate': endDate,
      'totalCostEst': totalCostEst,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
      'activities': activities.map((a) => a.toJson()).toList(),
    };
  }

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

  factory TravelPackage.fromJson(Map<String, dynamic> json) {
    return TravelPackage(
      id: json['id'] as String,
      creatorId: json['creatorId'] ?? json['creator_id'] as String? ?? '',
      itineraryId: json['itineraryId'] ?? json['itinerary_id'] as String? ?? '',
      title: json['title'] as String? ?? '',
      summary: json['summary'] as String? ?? '',
      description: json['description'] as String? ?? '',
      price: (json['price'] as num?)?.toDouble() ?? 0.0,
      status: json['status'] as String? ?? 'draft',
      ratingAvg:
          (json['ratingAvg'] ?? json['rating_avg'] as num?)?.toDouble() ?? 0.0,
      reviewsCount: json['reviewsCount'] ?? json['reviews_count'] as int? ?? 0,
      viewsCount: json['viewsCount'] ?? json['views_count'] as int? ?? 0,
      country: json['country'] as String? ?? '',
      location: json['location'] as String? ?? '',
      currency: json['currency'] as String? ?? 'USD',
      imageUrl: json['imageUrl'] ?? json['image_url'] as String? ?? '',
      durationDays: json['durationDays'] ?? json['duration_days'] as int? ?? 0,
      category: json['category'] as String? ?? '',
      groupSize: json['groupSize'] ?? json['group_size'] as String? ?? '',
      createdAt:
          DateTime.parse(json['createdAt'] ?? json['created_at'] as String),
      updatedAt:
          DateTime.parse(json['updatedAt'] ?? json['updated_at'] as String),
      itinerary: json['itinerary'] != null
          ? Itinerary.fromJson(json['itinerary'])
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'creatorId': creatorId,
      'itineraryId': itineraryId,
      'title': title,
      'summary': summary,
      'description': description,
      'price': price,
      'status': status,
      'ratingAvg': ratingAvg,
      'reviewsCount': reviewsCount,
      'viewsCount': viewsCount,
      'country': country,
      'location': location,
      'currency': currency,
      'imageUrl': imageUrl,
      'durationDays': durationDays,
      'category': category,
      'groupSize': groupSize,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
      'itinerary': itinerary?.toJson(),
    };
  }

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

  factory PackageReview.fromJson(Map<String, dynamic> json) {
    return PackageReview(
      id: json['id'] as String,
      packageId: json['packageId'] ?? json['package_id'] as String? ?? '',
      userId: json['userId'] ?? json['user_id'] as String? ?? '',
      rating: (json['rating'] as num?)?.toDouble() ?? 0.0,
      comment: json['comment'] as String? ?? '',
      createdAt:
          DateTime.parse(json['createdAt'] ?? json['created_at'] as String),
    );
  }

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

  factory PaginatedPackages.fromJson(Map<String, dynamic> json) {
    final packagesList = json['packages'] as List? ?? [];
    return PaginatedPackages(
      packages: packagesList.map((p) => TravelPackage.fromJson(p)).toList(),
      total: json['total'] as int? ?? 0,
      page: json['page'] as int? ?? 1,
      pageSize: json['pageSize'] ?? json['page_size'] as int? ?? 10,
    );
  }
}
