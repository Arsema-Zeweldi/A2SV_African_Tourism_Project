import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile/core/usecases/usecase.dart';
import 'package:mobile/features/profile/domain/usecases/get_profile_usecase.dart';
import 'package:mobile/features/profile/domain/usecases/update_profile_usecase.dart';
import 'package:mobile/features/profile/domain/usecases/change_password_usecase.dart';

import 'profile_event.dart';
import 'profile_state.dart';

class ProfileBloc extends Bloc<ProfileEvent, ProfileState> {
  final GetProfileUsecase getProfileUsecase;
  final UpdateProfileUsecase updateProfileUsecase;
  final ChangePasswordUsecase changePasswordUsecase;

  ProfileBloc({
    required this.getProfileUsecase,
    required this.updateProfileUsecase,
    required this.changePasswordUsecase,
  }) : super(ProfileInitial()) {
    on<LoadProfile>(_onLoadProfile);
    on<UpdateProfileRequested>(_onUpdateProfile);
    on<ChangePasswordRequested>(_onChangePassword);
  }

  Future<void> _onLoadProfile(LoadProfile event, Emitter<ProfileState> emit) async {
    emit(ProfileLoading());
    final result = await getProfileUsecase(NoParams());
    result.fold(
      (failure) => emit(ProfileError(failure.message)),
      (profile) => emit(ProfileLoaded(profile)),
    );
  }

  Future<void> _onUpdateProfile(UpdateProfileRequested event, Emitter<ProfileState> emit) async {
    emit(ProfileLoading());
    final result = await updateProfileUsecase(UpdateProfileParams(
      firstName: event.firstName,
      lastName: event.lastName,
      country: event.country,
      bio: event.bio,
      avatarUrl: event.avatarUrl,
    ));
    result.fold(
      (failure) => emit(ProfileError(failure.message)),
      (profile) => emit(ProfileUpdated(profile)),
    );
  }

  Future<void> _onChangePassword(ChangePasswordRequested event, Emitter<ProfileState> emit) async {
    emit(ProfileLoading());
    final result = await changePasswordUsecase(ChangePasswordParams(
      currentPassword: event.currentPassword,
      newPassword: event.newPassword,
      passwordConfirm: event.passwordConfirm,
    ));
    result.fold(
      (failure) => emit(ProfileError(failure.message)),
      (_) => emit(PasswordChanged()),
    );
  }
}
