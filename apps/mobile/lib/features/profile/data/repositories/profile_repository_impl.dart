import 'package:dartz/dartz.dart';
import 'package:mobile/core/error/failures.dart';
import 'package:mobile/core/network/exceptions.dart';
import 'package:mobile/features/profile/data/dataSources/profile_remote_data_source.dart';
import 'package:mobile/features/profile/domain/entities/profile_entity.dart';
import 'package:mobile/features/profile/domain/repositories/profile_repository.dart';

class ProfileRepositoryImpl implements ProfileRepository {
  final ProfileRemoteDataSource remoteDataSource;

  ProfileRepositoryImpl({required this.remoteDataSource});

  @override
  Future<Either<Failure, UserProfile>> getProfile() async {
    try {
      final result = await remoteDataSource.getProfile();
      return Right(result);
    } on UnauthorizedException {
      return const Left(AuthFailure('Unauthorized. Please log in again.'));
    } on NetworkException {
      return const Left(NetworkFailure('No internet connection.'));
    } on TimeoutException {
      return const Left(TimeoutFailure('Request timed out.'));
    } on ApiException catch (e) {
      return Left(ServerFailure(e.message));
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, UserProfile>> updateProfile({
    String? firstName,
    String? lastName,
    String? country,
    String? bio,
    String? avatarUrl,
  }) async {
    try {
      final result = await remoteDataSource.updateProfile(
        firstName: firstName,
        lastName: lastName,
        country: country,
        bio: bio,
        avatarUrl: avatarUrl,
      );
      return Right(result);
    } on UnauthorizedException {
      return const Left(AuthFailure('Unauthorized. Please log in again.'));
    } on NetworkException {
      return const Left(NetworkFailure('No internet connection.'));
    } on TimeoutException {
      return const Left(TimeoutFailure('Request timed out.'));
    } on ApiException catch (e) {
      return Left(ServerFailure(e.message));
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, UserPreferences>> getPreferences() async {
    try {
      final result = await remoteDataSource.getPreferences();
      return Right(result);
    } on UnauthorizedException {
      return const Left(AuthFailure('Unauthorized. Please log in again.'));
    } on NetworkException {
      return const Left(NetworkFailure('No internet connection.'));
    } on TimeoutException {
      return const Left(TimeoutFailure('Request timed out.'));
    } on ApiException catch (e) {
      return Left(ServerFailure(e.message));
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, UserPreferences>> updatePreferences(Map<String, dynamic> updates) async {
    try {
      final result = await remoteDataSource.updatePreferences(updates);
      return Right(result);
    } on UnauthorizedException {
      return const Left(AuthFailure('Unauthorized. Please log in again.'));
    } on NetworkException {
      return const Left(NetworkFailure('No internet connection.'));
    } on TimeoutException {
      return const Left(TimeoutFailure('Request timed out.'));
    } on ApiException catch (e) {
      return Left(ServerFailure(e.message));
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> changePassword({
    required String currentPassword,
    required String newPassword,
    required String passwordConfirm,
  }) async {
    try {
      await remoteDataSource.changePassword(
        currentPassword: currentPassword,
        newPassword: newPassword,
        passwordConfirm: passwordConfirm,
      );
      return const Right(null);
    } on UnauthorizedException {
      return const Left(AuthFailure('Unauthorized. Please log in again.'));
    } on NetworkException {
      return const Left(NetworkFailure('No internet connection.'));
    } on TimeoutException {
      return const Left(TimeoutFailure('Request timed out.'));
    } on ApiException catch (e) {
      return Left(ServerFailure(e.message));
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }
}
