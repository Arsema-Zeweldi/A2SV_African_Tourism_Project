import 'package:dartz/dartz.dart';
import 'package:mobile/core/error/failures.dart';
import 'package:mobile/core/usecases/usecase.dart';
import 'package:mobile/features/packages/domain/entities/package_entity.dart';
import 'package:mobile/features/packages/domain/repositories/package_repository.dart';

class GetPackageDetailUsecase implements UseCase<TravelPackage, String> {
  final PackageRepository repository;

  GetPackageDetailUsecase(this.repository);

  @override
  Future<Either<Failure, TravelPackage>> call(String packageId) {
    return repository.getPackageById(packageId);
  }
}
