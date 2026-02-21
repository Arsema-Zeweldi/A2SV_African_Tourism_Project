
import 'package:dartz/dartz.dart';
import 'package:mobile/core/error/failures.dart';
import 'package:mobile/core/usecases/usecase.dart';
import 'package:mobile/features/auth/domain/entities/user.dart';
import 'package:mobile/features/auth/domain/repositories/auth_repository.dart';

class SignInWithGoogleUsecase implements UseCase<User, NoParams> {
  final AuthRepository repository;

  SignInWithGoogleUsecase(this.repository);

  @override
  Future<Either<Failure, User>> call(NoParams params) {
    return repository.signInWithGoogle();
  }
}