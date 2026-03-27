import 'package:equatable/equatable.dart';
import 'package:mobile/features/auth/domain/entities/user.dart';

abstract class AuthState extends Equatable {
  const AuthState();

  @override
  List<Object?> get props => [];
}

/// Initial state — app hasn't checked auth yet.
class AuthInitial extends AuthState {}

/// A network/auth operation is in progress (show loading spinner).
class AuthLoading extends AuthState {}

/// User is logged in and we have their data.
class Authenticated extends AuthState {
  final User user;

  const Authenticated(this.user);

  @override
  List<Object?> get props => [user];
}

/// No user session — show the login/onboarding screen.
class Unauthenticated extends AuthState {}

/// An auth operation failed (login, signup, etc.). Carries the error message.
class AuthError extends AuthState {
  final String message;

  const AuthError(this.message);

  @override
  List<Object?> get props => [message];
}

/// Password reset email was sent successfully.
class PasswordResetSent extends AuthState {}
