import 'package:dartz/dartz.dart';
import 'package:mobile/core/error/failures.dart';
import 'package:mobile/core/usecases/usecase.dart';
import 'package:mobile/features/profile/domain/entities/profile_entity.dart';
import 'package:mobile/features/profile/domain/repositories/profile_repository.dart';

class GetProfileUsecase implements UseCase<UserProfile, NoParams> {
  final ProfileRepository repository;

  GetProfileUsecase(this.repository);

  @override
  Future<Either<Failure, UserProfile>> call(NoParams params) {
    return repository.getProfile();
  }
}
