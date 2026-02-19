import 'package:dartz/dartz.dart';
import 'package:mobile/core/error/failures.dart';
import 'package:mobile/core/usecases/usecase.dart';
import 'package:mobile/features/auth/domain/entities/user.dart';
import 'package:mobile/features/auth/domain/repositories/auth_repository.dart';

class SignUpUsecase implements UseCase<User, SignUpParams> {
  final AuthRepository repository;

  SignUpUsecase(this.repository);

  @override
  Future<Either<Failure, User>> call(SignUpParams params) {
    final validationFailure = params.validate();
    if (validationFailure != null) {
      return Future.value(Left(validationFailure));
    }

    return repository.signUp(
      fullName: params.fullName,
      email: params.email,
      password: params.password,
    );
  }
}

class SignUpParams {
  final String fullName;
  final String email;
  final String password;

  SignUpParams({
    required this.fullName,
    required this.email,
    required this.password,
  });

  Failure? validate() {
    if (email.trim().isEmpty) {
      return const InvalidEmailFailure();
    }

    if (!isValidEmail(email.trim())) {
      return const InvalidEmailFailure();
    }

    if (password.trim().isEmpty) {
      return const InvalidPasswordFailure();
    }

    if (password.trim().length < 6) {
      return const InvalidPasswordFailure();
    }

    if (fullName.trim().length < 2) {
      return const InvalidFullNameFailure();
    }

    if (fullName.trim().isEmpty) {
      return const InvalidFullNameFailure();
    }

    return null;
  }

  bool isValidEmail(String email) {
    return RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(email);
  }
}
