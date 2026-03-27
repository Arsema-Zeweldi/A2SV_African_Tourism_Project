import 'package:equatable/equatable.dart';

abstract class AuthEvent extends Equatable {
  const AuthEvent();

  @override
  List<Object?> get props => [];
}

/// Fired on app startup to check if user is already logged in.
class CheckAuthStatusRequested extends AuthEvent {}

/// Fired when user taps "Login" on the login screen.
class LoginRequested extends AuthEvent {
  final String email;
  final String password;

  const LoginRequested({required this.email, required this.password});

  @override
  List<Object?> get props => [email, password];
}

/// Fired when user taps "Create Account" on the sign-up screen.
class SignUpRequested extends AuthEvent {
  final String fullName;
  final String email;
  final String password;

  const SignUpRequested({
    required this.fullName,
    required this.email,
    required this.password,
  });

  @override
  List<Object?> get props => [fullName, email, password];
}

/// Fired when user taps "Send Reset Link" on the forgot-password screen.
class PasswordResetRequested extends AuthEvent {
  final String email;

  const PasswordResetRequested({required this.email});

  @override
  List<Object?> get props => [email];
}

/// Fired when user taps "Sign in with Google".
class GoogleSignInRequested extends AuthEvent {}

/// Fired when user taps "Logout" (from profile or settings).
class LogoutRequested extends AuthEvent {}
