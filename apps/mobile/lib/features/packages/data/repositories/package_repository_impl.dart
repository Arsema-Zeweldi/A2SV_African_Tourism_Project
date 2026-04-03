import 'package:dartz/dartz.dart';
import 'package:mobile/core/error/failures.dart';
import 'package:mobile/core/network/exceptions.dart';
import 'package:mobile/features/packages/data/dataSources/package_remote_data_source.dart';
import 'package:mobile/features/packages/domain/entities/package_entity.dart';
import 'package:mobile/features/packages/domain/repositories/package_repository.dart';

class PackageRepositoryImpl implements PackageRepository {
  final PackageRemoteDataSource remoteDataSource;

  PackageRepositoryImpl({required this.remoteDataSource});

  @override
  Future<Either<Failure, PaginatedPackages>> getPackagesFeed({
    String? sortBy,
    String? order,
    String? query,
    int page = 1,
    int pageSize = 20,
  }) async {
    try {
      final result = await remoteDataSource.getPackagesFeed(
        sortBy: sortBy,
        order: order,
        query: query,
        page: page,
        pageSize: pageSize,
      );
      return Right(PaginatedPackages(
        packages: result.packages,
        total: result.total,
        page: page,
        pageSize: pageSize,
      ));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } on TimeoutException catch (e) {
      return Left(TimeoutFailure(e.message));
    } on ApiException catch (e) {
      return Left(ServerFailure(e.message));
    } catch (e) {
      return Left(ServerFailure('An unexpected error occurred. Please try again.'));
    }
  }

  @override
  Future<Either<Failure, TravelPackage>> getPackageById(String id) async {
    try {
      final result = await remoteDataSource.getPackageById(id);
      return Right(result);
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } on TimeoutException catch (e) {
      return Left(TimeoutFailure(e.message));
    } on ApiException catch (e) {
      return Left(ServerFailure(e.message));
    } catch (e) {
      return Left(ServerFailure('An unexpected error occurred. Please try again.'));
    }
  }

  @override
  Future<Either<Failure, PaginatedPackages>> getMyPackages({
    String? query,
    int page = 1,
    int pageSize = 20,
  }) async {
    try {
      final result = await remoteDataSource.getMyPackages(
        query: query,
        page: page,
        pageSize: pageSize,
      );
      return Right(PaginatedPackages(
        packages: result.packages,
        total: result.total,
        page: page,
        pageSize: pageSize,
      ));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } on TimeoutException catch (e) {
      return Left(TimeoutFailure(e.message));
    } on ApiException catch (e) {
      return Left(ServerFailure(e.message));
    } catch (e) {
      return Left(ServerFailure('An unexpected error occurred. Please try again.'));
    }
  }

  @override
  Future<Either<Failure, List<PackageReview>>> getPackageReviews(String packageId) async {
    try {
      final result = await remoteDataSource.getPackageReviews(packageId);
      return Right(result);
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } on TimeoutException catch (e) {
      return Left(TimeoutFailure(e.message));
    } on ApiException catch (e) {
      return Left(ServerFailure(e.message));
    } catch (e) {
      return Left(ServerFailure('An unexpected error occurred. Please try again.'));
    }
  }

  @override
  Future<Either<Failure, void>> submitReview(
    String packageId, {
    required double rating,
    String comment = '',
  }) async {
    try {
      await remoteDataSource.submitReview(packageId, rating: rating, comment: comment);
      return const Right(null);
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } on TimeoutException catch (e) {
      return Left(TimeoutFailure(e.message));
    } on ApiException catch (e) {
      return Left(ServerFailure(e.message));
    } catch (e) {
      return Left(ServerFailure('An unexpected error occurred. Please try again.'));
    }
  }

  @override
  Future<Either<Failure, void>> updatePackageStatus(String packageId, String status) async {
    try {
      await remoteDataSource.updatePackageStatus(packageId, status);
      return const Right(null);
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } on TimeoutException catch (e) {
      return Left(TimeoutFailure(e.message));
    } on ApiException catch (e) {
      return Left(ServerFailure(e.message));
    } catch (e) {
      return Left(ServerFailure('An unexpected error occurred. Please try again.'));
    }
  }
}
