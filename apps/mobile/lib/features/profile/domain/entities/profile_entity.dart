import 'package:equatable/equatable.dart';

class UserProfile extends Equatable {
  final String userId;
  final String email;
  final String firstName;
  final String lastName;
  final String country;
  final String bio;
  final String avatarUrl;
  final String createdAt;

  const UserProfile({
    required this.userId,
    required this.email,
    required this.firstName,
    required this.lastName,
    required this.country,
    required this.bio,
    required this.avatarUrl,
    required this.createdAt,
  });

  String get fullName => '$firstName $lastName'.trim();

  @override
  List<Object?> get props => [userId, email, firstName, lastName, country, bio, avatarUrl, createdAt];
}

class UserPreferences extends Equatable {
  final String preferenceId;
  final String userId;
  final String? preferredSeason;
  final String? budgetRange;
  final List<String> preferredActivities;
  final List<String> dietaryRestrictions;
  final String? preferredClimate;
  final String? preferredLanguage;
  final String? travelVibeInterest;

  const UserPreferences({
    required this.preferenceId,
    required this.userId,
    this.preferredSeason,
    this.budgetRange,
    this.preferredActivities = const [],
    this.dietaryRestrictions = const [],
    this.preferredClimate,
    this.preferredLanguage,
    this.travelVibeInterest,
  });

  @override
  List<Object?> get props => [
        preferenceId,
        userId,
        preferredSeason,
        budgetRange,
        preferredActivities,
        dietaryRestrictions,
        preferredClimate,
        preferredLanguage,
        travelVibeInterest,
      ];
}
