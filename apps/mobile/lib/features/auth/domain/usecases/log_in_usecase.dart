import 'package:dartz/dartz.dart';
import 'package:mobile/core/error/failures.dart';
import 'package:mobile/core/usecases/usecase.dart';
import 'package:mobile/features/auth/domain/entities/user.dart';
import 'package:mobile/features/auth/domain/repositories/auth_repository.dart';

class LogInUsecase implements UseCase<User, LoginParams> {
  final AuthRepository repository;

  LogInUsecase(this.repository);

  @override
  Future<Either<Failure, User>> call(LoginParams params) {
    final validationFailure = params.validate();
    if (validationFailure != null) {
      return Future.value(Left(validationFailure));
    }

    return repository.logIn(
      email: params.email,
      password: params.password,
    );
  }
}

class LoginParams {
  final String email;
  final String password;

  LoginParams({
    required this.email,
    required this.password,
  });

  Failure? validate() {
    if (email.trim().isEmpty) {
      return const InvalidEmailFailure();
    }

    if (!_isValidEmail(email.trim())) {
      return const InvalidEmailFailure();
    }

    if (password.trim().isEmpty) {
      return const InvalidPasswordFailure();
    }

    if (password.trim().length < 6) {
      return const InvalidPasswordFailure();
    }

    return null;
  }

  bool _isValidEmail(String email) {
    return RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(email);
  }
}
