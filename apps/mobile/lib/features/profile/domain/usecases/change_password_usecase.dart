import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import 'package:mobile/core/error/failures.dart';
import 'package:mobile/core/usecases/usecase.dart';
import 'package:mobile/features/profile/domain/repositories/profile_repository.dart';

class ChangePasswordUsecase implements UseCase<void, ChangePasswordParams> {
  final ProfileRepository repository;

  ChangePasswordUsecase(this.repository);

  @override
  Future<Either<Failure, void>> call(ChangePasswordParams params) {
    if (params.newPassword.length < 8) {
      return Future.value(
        const Left(ServerFailure('Password must be at least 8 characters.')),
      );
    }
    if (params.newPassword != params.passwordConfirm) {
      return Future.value(
        const Left(ServerFailure('Passwords do not match.')),
      );
    }
    return repository.changePassword(
      currentPassword: params.currentPassword,
      newPassword: params.newPassword,
      passwordConfirm: params.passwordConfirm,
    );
  }
}

class ChangePasswordParams extends Equatable {
  final String currentPassword;
  final String newPassword;
  final String passwordConfirm;

  const ChangePasswordParams({
    required this.currentPassword,
    required this.newPassword,
    required this.passwordConfirm,
  });

  @override
  List<Object?> get props => [currentPassword, newPassword, passwordConfirm];
}
