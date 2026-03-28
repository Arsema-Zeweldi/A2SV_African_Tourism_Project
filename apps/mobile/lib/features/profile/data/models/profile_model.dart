import 'dart:convert';
import 'package:mobile/features/profile/domain/entities/profile_entity.dart';

class UserProfileModel extends UserProfile {
  const UserProfileModel({
    required super.userId,
    required super.email,
    required super.firstName,
    required super.lastName,
    required super.country,
    required super.bio,
    required super.avatarUrl,
    required super.createdAt,
  });

  factory UserProfileModel.fromJson(Map<String, dynamic> json) {
    return UserProfileModel(
      userId: json['user_id']?.toString() ?? '',
      email: json['email'] ?? '',
      firstName: json['first_name'] ?? '',
      lastName: json['last_name'] ?? '',
      country: json['country'] ?? '',
      bio: json['bio'] ?? '',
      avatarUrl: json['avatar_url'] ?? '',
      createdAt: json['created_at'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'user_id': userId,
      'email': email,
      'first_name': firstName,
      'last_name': lastName,
      'country': country,
      'bio': bio,
      'avatar_url': avatarUrl,
      'created_at': createdAt,
    };
  }
}

class UserPreferencesModel extends UserPreferences {
  const UserPreferencesModel({
    required super.preferenceId,
    required super.userId,
    super.preferredSeason,
    super.budgetRange,
    super.preferredActivities,
    super.dietaryRestrictions,
    super.preferredClimate,
    super.preferredLanguage,
    super.travelVibeInterest,
  });

  factory UserPreferencesModel.fromJson(Map<String, dynamic> json) {
    return UserPreferencesModel(
      preferenceId: json['preference_id']?.toString() ?? '',
      userId: json['user_id']?.toString() ?? '',
      preferredSeason: json['preferred_season'],
      budgetRange: json['budget_range'],
      preferredActivities: _parseStringList(json['preferred_activities']),
      dietaryRestrictions: _parseStringList(json['dietary_restrictions']),
      preferredClimate: json['preferred_climate'],
      preferredLanguage: json['preferred_language'],
      travelVibeInterest: json['travel_vibe_interest'],
    );
  }

  static List<String> _parseStringList(dynamic value) {
    if (value == null) return [];
    if (value is List) return value.map((e) => e.toString()).toList();
    if (value is String) {
      try {
        final decoded = jsonDecode(value);
        if (decoded is List) return decoded.map((e) => e.toString()).toList();
      } catch (_) {}
    }
    return [];
  }
}
