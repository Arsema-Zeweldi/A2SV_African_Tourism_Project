import 'package:mobile/core/constants/api_endpoints.dart';
import 'package:mobile/core/network/api_client.dart';
import 'package:mobile/core/network/exceptions.dart';
import 'package:mobile/features/auth/data/models/user_model.dart';

abstract class AuthRemoteDataSource {
  Future<UserModel> signUp({
    required String fullName,
    required String email,
    required String password,
  });

  Future<UserModel> logIn({
    required String email,
    required String password,
  });

  Future<void> logOut();

  Future<void> sendPasswordResetEmail({required String email});

  Future<UserModel> signInWithGoogle();

  Future<UserModel?> getCurrentUser();
}

class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
  final ApiClient apiClient;

  AuthRemoteDataSourceImpl({required this.apiClient});

  @override
  Future<UserModel?> getCurrentUser() async {
    try {
      final response = await apiClient.get(ApiEndpoints.getCurrentUser);
      if (response.statusCode == 200) {
        if (response.data['user'] != null) {
          return UserModel.fromJson(response.data['user']);
        } else if (response.data['data'] != null) {
          return UserModel.fromJson(response.data['data']);
        } else {
          return UserModel.fromJson(response.data);
        }
      }
      return null;
    } on UnauthorizedException catch (_) {
      return null;
    } on ApiException catch (e) {
      if (e.statusCode == 401) {
        return null;
      }
      rethrow;
    } on NetworkException {
      rethrow;
    } catch (e) {
      throw ApiException(
          message: 'Failed to get current user: ${e.toString()}');
    }
  }

  @override
  Future<UserModel> logIn(
      {required String email, required String password}) async {
    try {
      final response = await apiClient.post(
        ApiEndpoints.login,
        data: {
          'email': email,
          'password': password,
        },
      );

      if (response.data['user'] != null) {
        return UserModel.fromJson(response.data['user']);
      } else if (response.data['data'] != null) {
        return UserModel.fromJson(response.data['data']);
      } else {
        return UserModel.fromJson(response.data);
      }
    } on UnauthorizedException {
      rethrow;
    } on ApiException {
      rethrow;
    } on NetworkException {
      rethrow;
    } on TimeoutException {
      rethrow;
    } catch (e) {
      throw ApiException(message: 'Login failed: ${e.toString()}');
    }
  }

  @override
  Future<void> logOut() async {
    try {
      await apiClient.post(ApiEndpoints.logout);
    } on UnauthorizedException {
      return;
    } on ApiException catch (e) {
      print('Logout API error: ${e.message}');
    } on NetworkException catch (e) {
      print('Logout network error: ${e.message}');
    } catch (e) {
      print('Logout unexpected error: $e');
    }
  }

  @override
  Future<void> sendPasswordResetEmail({required String email}) async {
    try {
      await apiClient.post(
        ApiEndpoints.resetPassword,
        data: {'email': email},
      );
    } on UnauthorizedException {
      rethrow;
    } on ApiException {
      rethrow;
    } on NetworkException {
      rethrow;
    } on TimeoutException {
      rethrow;
    } catch (e) {
      throw ApiException(
          message: 'Failed to send reset email: ${e.toString()}');
    }
  }

  @override
  Future<UserModel> signInWithGoogle() async {
    try {
      final response = await apiClient.post(ApiEndpoints.googleSignIn);

      if (response.data['user'] != null) {
        return UserModel.fromJson(response.data['user']);
      } else if (response.data['data'] != null) {
        return UserModel.fromJson(response.data['data']);
      } else {
        return UserModel.fromJson(response.data);
      }
    } on UnauthorizedException {
      rethrow;
    } on ApiException {
      rethrow;
    } on NetworkException {
      rethrow;
    } on TimeoutException {
      rethrow;
    } catch (e) {
      throw ApiException(message: 'Google sign in failed: ${e.toString()}');
    }
  }

  @override
  Future<UserModel> signUp(
      {required String fullName,
      required String email,
      required String password}) async {
    try {
      final response = await apiClient.post(
        ApiEndpoints.signUp,
        data: {
          'fullName': fullName,
          'email': email,
          'password': password,
        },
      );

      if (response.data['user'] != null) {
        return UserModel.fromJson(response.data['user']);
      } else if (response.data['data'] != null) {
        return UserModel.fromJson(response.data['data']);
      } else {
        return UserModel.fromJson(response.data);
      }
    } on UnauthorizedException {
      rethrow;
    } on ApiException {
      rethrow;
    } on NetworkException {
      rethrow;
    } on TimeoutException {
      rethrow;
    } catch (e) {
      throw ApiException(message: 'Sign up failed. ${e.toString()}');
    }
  }
}
