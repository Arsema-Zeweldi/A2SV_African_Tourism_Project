
import 'package:dartz/dartz.dart';
import 'package:mobile/core/error/failures.dart';
import 'package:mobile/core/usecases/usecase.dart';
import 'package:mobile/features/auth/domain/repositories/auth_repository.dart';

class LogOutUsecase implements UseCase<void, NoParams> {
  final AuthRepository repository;

  LogOutUsecase(this.repository);

  @override
  Future<Either<Failure, void>> call(NoParams params) {
    return repository.logOut();
  }
}