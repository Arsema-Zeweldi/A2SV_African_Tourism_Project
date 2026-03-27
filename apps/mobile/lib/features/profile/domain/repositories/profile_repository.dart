import 'package:dartz/dartz.dart';
import 'package:mobile/core/error/failures.dart';
import 'package:mobile/features/profile/domain/entities/profile_entity.dart';

abstract class ProfileRepository {
  Future<Either<Failure, UserProfile>> getProfile();
  Future<Either<Failure, UserProfile>> updateProfile({
    String? firstName,
    String? lastName,
    String? country,
    String? bio,
    String? avatarUrl,
  });
  Future<Either<Failure, UserPreferences>> getPreferences();
  Future<Either<Failure, UserPreferences>> updatePreferences(Map<String, dynamic> updates);
  Future<Either<Failure, void>> changePassword({
    required String currentPassword,
    required String newPassword,
    required String passwordConfirm,
  });
}
