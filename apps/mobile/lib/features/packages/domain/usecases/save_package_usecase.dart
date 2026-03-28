import 'package:dartz/dartz.dart';
import 'package:mobile/core/error/failures.dart';
import 'package:mobile/core/usecases/usecase.dart';
import 'package:mobile/features/packages/domain/repositories/package_repository.dart';

class SavePackageUsecase implements UseCase<void, SavePackageParams> {
  final PackageRepository repository;

  SavePackageUsecase(this.repository);

  @override
  Future<Either<Failure, void>> call(SavePackageParams params) {
    return repository.savePackage(params.packageId);
  }
}

class SavePackageParams {
  final String packageId;
  SavePackageParams({required this.packageId});
}