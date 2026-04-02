import 'package:mobile/features/auth/domain/entities/user.dart';

class UserModel extends User {
  const UserModel({
    required String id,
    required String fullName,
    required String email,
    required DateTime createdAt,
    String? profilePictureUrl,
  }) : super(
          id: id,
          fullName: fullName,
          email: email,
          createdAt: createdAt,
          profilePictureUrl: profilePictureUrl,
        );

  /// Parses a user from JSON.
  ///
  /// Handles two backend response shapes:
  ///   1. Auth response (minimal): { "id": "...", "email": "..." }
  ///   2. Profile response (full):  { "user_id": "...", "first_name": "...", "avatar_url": "...", ... }
  factory UserModel.fromJson(Map<String, dynamic> json) {
    // The backend uses 'user_id' in profile responses, 'id' in auth responses.
    final id = json['id']?.toString() ??
        json['user_id']?.toString() ??
        '';

    // Build full name from available fields.
    final fullName = json['fullName'] ??
        _buildFullName(json['first_name'], json['last_name']) ??
        json['name'] ??
        '';

    final email = json['email'] ?? '';

    // Parse createdAt if present, otherwise default to now.
    DateTime createdAt;
    if (json['createdAt'] != null) {
      createdAt = DateTime.parse(json['createdAt']);
    } else if (json['created_at'] != null) {
      createdAt = DateTime.tryParse(json['created_at'].toString()) ?? DateTime.now();
    } else {
      createdAt = DateTime.now();
    }

    // Backend profile response uses 'avatar_url' (see dto.go UserProfileResponse).
    final profilePictureUrl =
        json['profilePictureUrl'] ??
        json['avatar_url'] ??
        json['profile_image_url'];

    return UserModel(
      id: id,
      fullName: fullName,
      email: email,
      createdAt: createdAt,
      profilePictureUrl: profilePictureUrl,
    );
  }

  /// Helper to combine first + last name.
  static String? _buildFullName(dynamic firstName, dynamic lastName) {
    if (firstName == null && lastName == null) return null;
    return '${firstName ?? ''} ${lastName ?? ''}'.trim();
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'fullName': fullName,
      'email': email,
      'createdAt': createdAt.toIso8601String(),
      'profilePictureUrl': profilePictureUrl,
    };
  }

  factory UserModel.fromEntity(User user) {
    return UserModel(
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      createdAt: user.createdAt,
      profilePictureUrl: user.profilePictureUrl,
    );
  }
}
