import 'package:dartz/dartz.dart';
import 'package:mobile/core/error/failures.dart';
import 'package:mobile/core/usecases/usecase.dart';
import 'package:mobile/features/packages/domain/entities/package_entity.dart';
import 'package:mobile/features/packages/domain/repositories/package_repository.dart';

class GetMyPackagesUsecase implements UseCase<PaginatedPackages, MyPackagesParams> {
  final PackageRepository repository;

  GetMyPackagesUsecase(this.repository);

  @override
  Future<Either<Failure, PaginatedPackages>> call(MyPackagesParams params) {
    return repository.getMyPackages(
      query: params.query,
      page: params.page,
      pageSize: params.pageSize,
    );
  }
}

class MyPackagesParams {
  final String? query;
  final int page;
  final int pageSize;

  const MyPackagesParams({
    this.query,
    this.page = 1,
    this.pageSize = 20,
  });
}
