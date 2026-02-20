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

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'],
      fullName: json['fullName'],
      email: json['email'],
      createdAt: DateTime.parse(json['createdAt']),
      profilePictureUrl: json['profilePictureUrl'],
    );
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
