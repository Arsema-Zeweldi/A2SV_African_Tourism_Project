import 'package:mobile/core/constants/api_endpoints.dart';
import 'package:mobile/core/network/api_client.dart';
import 'package:mobile/features/profile/data/models/profile_model.dart';

abstract class ProfileRemoteDataSource {
  Future<UserProfileModel> getProfile();
  Future<UserProfileModel> updateProfile({
    String? firstName,
    String? lastName,
    String? country,
    String? bio,
    String? avatarUrl,
  });
  Future<UserPreferencesModel> getPreferences();
  Future<UserPreferencesModel> updatePreferences(Map<String, dynamic> updates);
  Future<void> changePassword({
    required String currentPassword,
    required String newPassword,
    required String passwordConfirm,
  });
}

class ProfileRemoteDataSourceImpl implements ProfileRemoteDataSource {
  final ApiClient apiClient;

  ProfileRemoteDataSourceImpl({required this.apiClient});

  @override
  Future<UserProfileModel> getProfile() async {
    final response = await apiClient.get(ApiEndpoints.profile);
    final json = response.data;
    final data = json is Map<String, dynamic> && json.containsKey('data')
        ? json['data'] as Map<String, dynamic>
        : json as Map<String, dynamic>;
    return UserProfileModel.fromJson(data);
  }

  @override
  Future<UserProfileModel> updateProfile({
    String? firstName,
    String? lastName,
    String? country,
    String? bio,
    String? avatarUrl,
  }) async {
    final body = <String, dynamic>{};
    if (firstName != null) body['first_name'] = firstName;
    if (lastName != null) body['last_name'] = lastName;
    if (country != null) body['country'] = country;
    if (bio != null) body['bio'] = bio;
    if (avatarUrl != null) body['avatar_url'] = avatarUrl;

    final response = await apiClient.patch(ApiEndpoints.profile, data: body);
    final json = response.data;
    final data = json is Map<String, dynamic> && json.containsKey('data')
        ? json['data'] as Map<String, dynamic>
        : json as Map<String, dynamic>;
    return UserProfileModel.fromJson(data);
  }

  @override
  Future<UserPreferencesModel> getPreferences() async {
    final response = await apiClient.get(ApiEndpoints.preferences);
    final json = response.data;
    final data = json is Map<String, dynamic> && json.containsKey('data')
        ? json['data'] as Map<String, dynamic>
        : json as Map<String, dynamic>;
    return UserPreferencesModel.fromJson(data);
  }

  @override
  Future<UserPreferencesModel> updatePreferences(Map<String, dynamic> updates) async {
    final response = await apiClient.patch(ApiEndpoints.preferences, data: updates);
    final json = response.data;
    final data = json is Map<String, dynamic> && json.containsKey('data')
        ? json['data'] as Map<String, dynamic>
        : json as Map<String, dynamic>;
    return UserPreferencesModel.fromJson(data);
  }

  @override
  Future<void> changePassword({
    required String currentPassword,
    required String newPassword,
    required String passwordConfirm,
  }) async {
    await apiClient.post('/user/change-password', data: {
      'current_password': currentPassword,
      'new_password': newPassword,
      'password_confirm': passwordConfirm,
    });
  }
}
