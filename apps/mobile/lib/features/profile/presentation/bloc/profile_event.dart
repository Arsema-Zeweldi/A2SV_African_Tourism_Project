import 'package:equatable/equatable.dart';

abstract class ProfileEvent extends Equatable {
  const ProfileEvent();
  @override
  List<Object?> get props => [];
}

class LoadProfile extends ProfileEvent {
  const LoadProfile();
}

class UpdateProfileRequested extends ProfileEvent {
  final String? firstName;
  final String? lastName;
  final String? country;
  final String? bio;
  final String? avatarUrl;

  const UpdateProfileRequested({
    this.firstName,
    this.lastName,
    this.country,
    this.bio,
    this.avatarUrl,
  });

  @override
  List<Object?> get props => [firstName, lastName, country, bio, avatarUrl];
}

class ChangePasswordRequested extends ProfileEvent {
  final String currentPassword;
  final String newPassword;
  final String passwordConfirm;

  const ChangePasswordRequested({
    required this.currentPassword,
    required this.newPassword,
    required this.passwordConfirm,
  });

  @override
  List<Object?> get props => [currentPassword, newPassword, passwordConfirm];
}
