import 'dart:convert';

import 'package:mobile/core/error/failures.dart';
import 'package:mobile/features/auth/data/models/user_model.dart';
import 'package:shared_preferences/shared_preferences.dart';

abstract class AuthLocalDataSource {
  Future<void> cacheUser(UserModel user);

  Future<UserModel?> getCachedUser();

  Future<void> clearCachedUser();

  Future<void> cacheAuthToken(String token);

  Future<String?> getCachedAuthToken();
}

class AuthLocalDataSoureImpl implements AuthLocalDataSource {
  final SharedPreferences sharedPreferences;
  static const String CACHED_USER = 'CACHED_USER';
  static const String AUTH_TOKEN = 'AUTH_TOKEN';

  AuthLocalDataSoureImpl({required this.sharedPreferences});

  @override
  Future<void> cacheAuthToken(String token) async {
    try {
      await sharedPreferences.setString(AUTH_TOKEN, token);
    } catch (e) {
      throw CacheFailure('Failed to cache auth token: ${e.toString()}');
    }
  }

  @override
  Future<void> cacheUser(UserModel user) async {
    try {
      final userJson = json.encode(user.toJson());
      await sharedPreferences.setString(CACHED_USER, userJson);
    } catch (e) {
      throw CacheFailure('Failed to cache user: ${e.toString()}');
    }
  }

  @override
  Future<void> clearCachedUser() async {
    try {
      await sharedPreferences.remove(CACHED_USER);
      await sharedPreferences.remove(AUTH_TOKEN);
    } catch (e) {
      throw CacheFailure('Failed to clear cached user: ${e.toString()}');
    }
  }

  @override
  Future<String?> getCachedAuthToken() async {
    try {
      return sharedPreferences.getString(AUTH_TOKEN);
    } catch (e) {
      throw CacheFailure('Failed to get auth token: ${e.toString()}');
    }
  }

  @override
  Future<UserModel?> getCachedUser() async {
    try {
      final userJson = sharedPreferences.getString(CACHED_USER);
      if (userJson != null) {
        return UserModel.fromJson(json.decode(userJson));
      }
      return null;
    } catch (e) {
      throw CacheFailure('Failed to get cached user: ${e.toString()}');
    }
  }
}
