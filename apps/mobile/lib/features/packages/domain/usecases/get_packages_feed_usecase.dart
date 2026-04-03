import 'package:dartz/dartz.dart';
import 'package:mobile/core/error/failures.dart';
import 'package:mobile/core/usecases/usecase.dart';
import 'package:mobile/features/packages/domain/entities/package_entity.dart';
import 'package:mobile/features/packages/domain/repositories/package_repository.dart';

class GetPackagesFeedUsecase implements UseCase<PaginatedPackages, PackageFeedParams> {
  final PackageRepository repository;

  GetPackagesFeedUsecase(this.repository);

  @override
  Future<Either<Failure, PaginatedPackages>> call(PackageFeedParams params) {
    return repository.getPackagesFeed(
      sortBy: params.sortBy,
      order: params.order,
      query: params.query,
      page: params.page,
      pageSize: params.pageSize,
    );
  }
}

class PackageFeedParams {
  final String? sortBy;
  final String? order;
  final String? query;
  final int page;
  final int pageSize;

  const PackageFeedParams({
    this.sortBy,
    this.order,
    this.query,
    this.page = 1,
    this.pageSize = 20,
  });
}
