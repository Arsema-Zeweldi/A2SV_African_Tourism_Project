
import 'package:dartz/dartz.dart';
import 'package:mobile/core/error/failures.dart';
import 'package:mobile/core/usecases/usecase.dart';
import 'package:mobile/features/auth/domain/repositories/auth_repository.dart';

class SendPasswordResetEmailUsecase implements UseCase<void, SendPasswordResetEmailParams> {
  final AuthRepository repository;

  SendPasswordResetEmailUsecase(this.repository);

  @override
  Future<Either<Failure, void>> call(SendPasswordResetEmailParams params) {

    if(!params.isValidEmail) {
      return Future.value(Left(InvalidEmailFailure()));
    }
    return repository.sendPasswordResetEmail(email: params.email);
  }
}

class SendPasswordResetEmailParams {
  final String email;

  SendPasswordResetEmailParams({required this.email});

  bool get isValidEmail { return RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(email); }
}