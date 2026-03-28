import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile/core/usecases/usecase.dart';
import 'package:mobile/features/auth/domain/usecases/log_in_usecase.dart';
import 'package:mobile/features/auth/domain/usecases/log_out_usecase.dart';
import 'package:mobile/features/auth/domain/usecases/send_password_reset_email_usecase.dart';
import 'package:mobile/features/auth/domain/usecases/sign_in_with_google.dart';
import 'package:mobile/features/auth/domain/usecases/sign_up_usecase.dart';
import 'package:mobile/features/auth/domain/repositories/auth_repository.dart';

import 'auth_event.dart';
import 'auth_state.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final LogInUsecase logInUsecase;
  final SignUpUsecase signUpUsecase;
  final LogOutUsecase logOutUsecase;
  final SendPasswordResetEmailUsecase sendPasswordResetEmailUsecase;
  final SignInWithGoogleUsecase signInWithGoogleUsecase;
  final AuthRepository authRepository;

  AuthBloc({
    required this.logInUsecase,
    required this.signUpUsecase,
    required this.logOutUsecase,
    required this.sendPasswordResetEmailUsecase,
    required this.signInWithGoogleUsecase,
    required this.authRepository,
  }) : super(AuthInitial()) {
    on<CheckAuthStatusRequested>(_onCheckAuthStatus);
    on<LoginRequested>(_onLogin);
    on<SignUpRequested>(_onSignUp);
    on<PasswordResetRequested>(_onPasswordReset);
    on<GoogleSignInRequested>(_onGoogleSignIn);
    on<LogoutRequested>(_onLogout);
  }

  /// Check if we have a cached user session on app startup.
  Future<void> _onCheckAuthStatus(
    CheckAuthStatusRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());

    final result = await authRepository.getCurrentUser();

    result.fold(
      (failure) => emit(Unauthenticated()),
      (user) {
        if (user != null) {
          emit(Authenticated(user));
        } else {
          emit(Unauthenticated());
        }
      },
    );
  }

  /// Handle login with email + password.
  Future<void> _onLogin(
    LoginRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());

    final result = await logInUsecase(
      LoginParams(email: event.email, password: event.password),
    );

    result.fold(
      (failure) => emit(AuthError(failure.message)),
      (user) => emit(Authenticated(user)),
    );
  }

  /// Handle sign up with full name, email, and password.
  Future<void> _onSignUp(
    SignUpRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());

    final result = await signUpUsecase(
      SignUpParams(
        fullName: event.fullName,
        email: event.email,
        password: event.password,
      ),
    );

    result.fold(
      (failure) => emit(AuthError(failure.message)),
      (_) => emit(RegistrationSuccess()),
    );
  }

  /// Handle password reset — sends email, then shows success state.
  Future<void> _onPasswordReset(
    PasswordResetRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());

    final result = await sendPasswordResetEmailUsecase(
      SendPasswordResetEmailParams(email: event.email),
    );

    result.fold(
      (failure) => emit(AuthError(failure.message)),
      (_) => emit(PasswordResetSent()),
    );
  }

  /// Handle Google Sign-In.
  Future<void> _onGoogleSignIn(
    GoogleSignInRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());

    final result = await signInWithGoogleUsecase(NoParams());

    result.fold(
      (failure) => emit(AuthError(failure.message)),
      (user) => emit(Authenticated(user)),
    );
  }

  /// Handle logout — clear session and go to unauthenticated.
  Future<void> _onLogout(
    LogoutRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());

    final result = await logOutUsecase(NoParams());

    result.fold(
      (failure) => emit(AuthError(failure.message)),
      (_) => emit(Unauthenticated()),
    );
  }
}
