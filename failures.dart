import 'package:equatable/equatable.dart';

abstract class Failure extends Equatable {
  // If you want to pass a specific error message, you can add it here
  final String message;

  const Failure(this.message);

  @override
  List<Object> get props => [message];
}

class ServerFailure extends Failure {
  const ServerFailure(super.message);
}

class CacheFailure extends Failure {
  const CacheFailure(super.message);
}

class NetworkFailure extends Failure {
  const NetworkFailure(super.message);
}

class InvalidEmailFailure extends Failure {
  const InvalidEmailFailure():super('The email address is invalid format.');
}

class InvalidPasswordFailure extends Failure {
  const InvalidPasswordFailure():super('The password must be at least 6 characters long.');
}

class InvalidFullNameFailure extends Failure {
  const InvalidFullNameFailure():super('The full name must be at least 2 characters long.');
}

class AuthFailure extends Failure {
  const AuthFailure(String message) : super(message);
}

class TimeoutFailure extends Failure {
  const TimeoutFailure(String message) : super(message);
}
