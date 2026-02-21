class User {
  final String id;
  final String fullName;
  final String email;
  final DateTime createdAt;
  final String? profilePictureUrl;

  const User({
    required this.id,
    required this.fullName,
    required this.email,
    required this.createdAt,
    this.profilePictureUrl,
  });
}