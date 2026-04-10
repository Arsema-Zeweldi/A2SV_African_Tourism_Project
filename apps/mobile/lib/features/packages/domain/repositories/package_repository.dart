import 'package:dartz/dartz.dart';
import 'package:mobile/core/error/failures.dart';
import 'package:mobile/features/packages/domain/entities/package_entity.dart';

abstract class PackageRepository {
  Future<Either<Failure, PaginatedPackages>> getPackagesFeed({
    String? sortBy,
    String? order,
    String? query,
    int page = 1,
    int pageSize = 20,
  });

  Future<Either<Failure, TravelPackage>> getPackageById(String id);

  Future<Either<Failure, PaginatedPackages>> getMyPackages({
    String? query,
    int page = 1,
    int pageSize = 20,
  });

  Future<Either<Failure, List<PackageReview>>> getPackageReviews(String packageId);

  Future<Either<Failure, void>> submitReview(
    String packageId, {
    required double rating,
    String comment,
  });

  Future<Either<Failure, void>> updatePackageStatus(String packageId, String status);

  Future<Either<Failure, TravelPackage>> savePackage({
    required String itineraryId,
    required String title,
    required String description,
    required int durationDays,
    required double totalCost,
    required String status,
  });
}
