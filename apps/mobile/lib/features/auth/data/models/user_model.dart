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
  ///   2. Profile response (full):  { "user_id": "...", "first_name": "...", ... }
 factory UserModel.fromJson(Map<String, dynamic> json) {
  // ID
  final id = (json['user_id'] ?? json['id'] ?? '').toString();

  // Email
  final email = (json['email'] ?? '').toString();

  // Full name: try various fields, fall back to email or default
  String fullName = '';
  if (json['fullName'] != null && json['fullName'].toString().isNotEmpty) {
    fullName = json['fullName'].toString();
  } else if (json['first_name'] != null && json['last_name'] != null) {
    fullName = '${json['first_name']} ${json['last_name']}'.trim();
  } else if (json['first_name'] != null) {
    fullName = json['first_name'].toString();
  } else if (json['last_name'] != null) {
    fullName = json['last_name'].toString();
  } else if (email.isNotEmpty) {
    fullName = email; // fallback to email
  } else {
    fullName = 'User'; // ultimate fallback
  }

  // Created at
  DateTime createdAt;
  if (json['createdAt'] != null) {
    createdAt = DateTime.parse(json['createdAt'].toString());
  } else if (json['created_at'] != null) {
    createdAt = DateTime.parse(json['created_at'].toString());
  } else {
    createdAt = DateTime.now();
  }

  final profilePictureUrl = json['profilePictureUrl'] ?? json['profile_image_url'];

  return UserModel(
    id: id,
    fullName: fullName,
    email: email,
    createdAt: createdAt,
    profilePictureUrl: profilePictureUrl is String ? profilePictureUrl : null,
  );
}

  /// Helper to combine first + last name.
  // static String? _buildFullName(dynamic firstName, dynamic lastName) {
  //   if (firstName == null && lastName == null) return null;
  //   return '${firstName ?? ''} ${lastName ?? ''}'.trim();
  // }

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
