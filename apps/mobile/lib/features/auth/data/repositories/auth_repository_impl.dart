import 'package:dartz/dartz.dart';
import 'package:mobile/core/error/failures.dart';
import 'package:mobile/core/network/exceptions.dart';
import 'package:mobile/features/auth/data/dataSources/auth_local_data_source_data.dart';
import 'package:mobile/features/auth/data/dataSources/auth_remote_data_source.dart';
import 'package:mobile/features/auth/domain/entities/user.dart';
import 'package:mobile/features/auth/domain/repositories/auth_repository.dart';

class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource remoteDataSource;
  final AuthLocalDataSource localDataSource;

  AuthRepositoryImpl(
      {required this.remoteDataSource, required this.localDataSource});

  @override
  Future<Either<Failure, User?>> getCurrentUser() async {
    try {
      final user = await remoteDataSource.getCurrentUser();

      if (user != null) {
        await localDataSource.cacheUser(user);
        return Right(user);
      }

      final cachedUser = await localDataSource.getCachedUser();
      return Right(cachedUser);
    } on NetworkException catch (_) {
      // If network error, fallback to cache
      final cachedUser = await localDataSource.getCachedUser();
      return Right(cachedUser);
    } on TimeoutException catch (_) {
      // If timeout, fallback to cache
      final cachedUser = await localDataSource.getCachedUser();
      return Right(cachedUser);
    } on ApiException catch (e) {
      // If API error (not 401), still try cache
      if (e.statusCode != 401) {
        final cachedUser = await localDataSource.getCachedUser();
        return Right(cachedUser);
      }
      return const Right(null);
    } catch (e) {
      // For other errors, still try cache
      final cachedUser = await localDataSource.getCachedUser();
      return Right(cachedUser);
    }
  }

  @override
  Future<Either<Failure, User>> logIn(
      {required String email, required String password}) async {
    try {
      final user =
          await remoteDataSource.logIn(email: email, password: password);

      await localDataSource.cacheUser(user);

      return Right(user);
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } on TimeoutException catch (e) {
      return Left(TimeoutFailure(e.message));
    } on ApiException catch (e) {
      if (e.statusCode == 401) {
        return Left(AuthFailure('Invalid email or password'));
      }
      return Left(ServerFailure(e.message));
    } on UnauthorizedException catch (e) {
      return Left(AuthFailure(e.message));
    } catch (e) {
      return Left(
          ServerFailure('An unexpected error occurred. Please try again.'));
    }
  }

  @override
  Future<Either<Failure, void>> logOut() async {
    try {
      await remoteDataSource.logOut();
    } catch (e) {
      print('Remote logout failed: $e');
    } finally {
      await localDataSource.clearCachedUser();
    }
    return const Right(null);
  }

  @override
  Future<Either<Failure, void>> sendPasswordResetEmail(
      {required String email}) async {
    try {
      await remoteDataSource.sendPasswordResetEmail(email: email);
      return const Right(null);
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } on TimeoutException catch (e) {
      return Left(TimeoutFailure(e.message));
    } on ApiException catch (e) {
      if (e.statusCode == 404 ||
          e.message.toLowerCase().contains('user not found') ||
          e.message.toLowerCase().contains('email not found')) {
        return Left(AuthFailure('No account found with this email address.'));
      }
      return Left(ServerFailure(e.message));
    } catch (e) {
      return Left(
          ServerFailure('An unexpected error occurred. Please try again.'));
    }
  }

  @override
  Future<Either<Failure, User>> signInWithGoogle() async {
    try {
      final user = await remoteDataSource.signInWithGoogle();
      await localDataSource.cacheUser(user);
      return Right(user);
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } on TimeoutException catch (e) {
      return Left(TimeoutFailure(e.message));
    } on ApiException catch (e) {
      if (e.message.toLowerCase().contains('cancelled') ||
          e.message.toLowerCase().contains('canceled')) {
        return Left(AuthFailure('Google sign in was cancelled.'));
      }
      return Left(ServerFailure(e.message));
    } on UnauthorizedException catch (e) {
      return Left(AuthFailure(e.message));
    } catch (e) {
      return Left(
          ServerFailure('An unexpected error occurred. Please try again.'));
    }
  }

  @override
  Future<Either<Failure, User>> signUp(
      {required String fullName,
      required String email,
      required String password}) async {
    try {
      final user = await remoteDataSource.signUp(
          fullName: fullName, email: email, password: password);

      await localDataSource.cacheUser(user);

      return Right(user);
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } on TimeoutException catch (e) {
      return Left(TimeoutFailure(e.message));
    } on ApiException catch (e) {
      if (e.statusCode == 409 ||
          e.message.toLowerCase().contains('email already exists') ||
          e.message.toLowerCase().contains('email already registered')) {
        return Left(AuthFailure(
            'This email is already registered. Please login instead.'));
      }
      return Left(ServerFailure(e.message));
    } on UnauthorizedException catch (e) {
      return Left(AuthFailure(e.message));
    } catch (e) {
      return Left(
          ServerFailure('An unexpected error occurred. Please try again.'));
    }
  }
}
