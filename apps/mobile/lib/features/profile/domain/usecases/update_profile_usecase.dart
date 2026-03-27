import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import 'package:mobile/core/error/failures.dart';
import 'package:mobile/core/usecases/usecase.dart';
import 'package:mobile/features/profile/domain/entities/profile_entity.dart';
import 'package:mobile/features/profile/domain/repositories/profile_repository.dart';

class UpdateProfileUsecase implements UseCase<UserProfile, UpdateProfileParams> {
  final ProfileRepository repository;

  UpdateProfileUsecase(this.repository);

  @override
  Future<Either<Failure, UserProfile>> call(UpdateProfileParams params) {
    return repository.updateProfile(
      firstName: params.firstName,
      lastName: params.lastName,
      country: params.country,
      bio: params.bio,
      avatarUrl: params.avatarUrl,
    );
  }
}

class UpdateProfileParams extends Equatable {
  final String? firstName;
  final String? lastName;
  final String? country;
  final String? bio;
  final String? avatarUrl;

  const UpdateProfileParams({
    this.firstName,
    this.lastName,
    this.country,
    this.bio,
    this.avatarUrl,
  });

  @override
  List<Object?> get props => [firstName, lastName, country, bio, avatarUrl];
}
