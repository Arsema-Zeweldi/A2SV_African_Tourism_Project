import 'package:mobile/core/constants/api_endpoints.dart';
import 'package:mobile/core/network/api_client.dart';
import 'package:mobile/core/network/exceptions.dart';
import 'package:mobile/features/auth/data/models/user_model.dart';

abstract class AuthRemoteDataSource {
  Future<void> signUp({
    required String fullName,
    required String email,
    required String password,
  });

  Future<({String token, String userId, String email, String status})> logIn({
    required String email,
    required String password,
  });

  Future<void> logOut();

  Future<void> sendPasswordResetEmail({required String email});

  Future<UserModel> signInWithGoogle();

  Future<UserModel> getCurrentUser();
}

class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
  final ApiClient apiClient;

  AuthRemoteDataSourceImpl({required this.apiClient});

  @override
  Future<UserModel> getCurrentUser() async {
    try {
      final response = await apiClient.get(ApiEndpoints.getCurrentUser);
      final userJson = response.data['user'] ?? response.data['data'] ?? response.data;
      if (userJson == null) {
        throw ApiException(message: 'User data not found in response');
      }
      return UserModel.fromJson(userJson);

    } on UnauthorizedException catch (_) {
      rethrow;
    } on ApiException catch (e) {
      if (e.statusCode == 401) {
        rethrow;
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
  Future<({String token, String userId, String email, String status})> logIn(
      {required String email, required String password}) async {
    try {
      final response = await apiClient.post(
        ApiEndpoints.login,
        data: {
          'email': email,
          'password': password,
        },
      );

      // BUG FIX: Save the JWT token from the response so subsequent
      // API calls include it in the Authorization header.
      final token = response.data['token'] as String;
      final user = response.data['user'] as Map<String, dynamic>;
      final userId = user['id'] as String? ?? '';
      final emailAddr = user['email'] as String? ?? '';
      final status = response.data['status'] as String? ?? '';

      await apiClient.sharedPreferences.setString('AUTH_TOKEN', token);

      return (token: token, userId: userId, email: emailAddr, status: status);
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
  Future<void> signUp(
      {required String fullName,
      required String email,
      required String password}) async {
    try {
      final nameParts = fullName.trim().split(' ');
      final firstName = nameParts.first;
      final lastName = nameParts.length > 1 ? nameParts.sublist(1).join(' '): '';
      final response = await apiClient.post(
        ApiEndpoints.signUp,
        data: {
          'first_name': firstName,
          'last_name': lastName,
          'email': email,
          'password': password,
        },
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
      throw ApiException(message: 'Sign up failed. ${e.toString()}');
    }
  }
}
