import 'package:get_it/get_it.dart';
import 'package:internet_connection_checker/internet_connection_checker.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:mobile/core/network/api_client.dart';
import 'package:mobile/core/network/network_info.dart';
import 'package:mobile/features/auth/data/dataSources/auth_local_data_source_data.dart';
import 'package:mobile/features/auth/data/dataSources/auth_remote_data_source.dart';
import 'package:mobile/features/auth/data/repositories/auth_repository_impl.dart';
import 'package:mobile/features/auth/domain/repositories/auth_repository.dart';
import 'package:mobile/features/auth/domain/usecases/log_in_usecase.dart';
import 'package:mobile/features/auth/domain/usecases/log_out_usecase.dart';
import 'package:mobile/features/auth/domain/usecases/send_password_reset_email_usecase.dart';
import 'package:mobile/features/auth/domain/usecases/sign_in_with_google.dart';
import 'package:mobile/features/auth/domain/usecases/sign_up_usecase.dart';
import 'package:mobile/features/auth/presentation/bloc/auth_bloc.dart';

// ── Profile Feature ──────────────────────────────────────────
import 'package:mobile/features/profile/data/dataSources/profile_remote_data_source.dart';
import 'package:mobile/features/profile/data/repositories/profile_repository_impl.dart';
import 'package:mobile/features/profile/domain/repositories/profile_repository.dart';
import 'package:mobile/features/profile/domain/usecases/get_profile_usecase.dart';
import 'package:mobile/features/profile/domain/usecases/update_profile_usecase.dart';
import 'package:mobile/features/profile/domain/usecases/change_password_usecase.dart';
import 'package:mobile/features/profile/presentation/bloc/profile_bloc.dart';

// ── Planner Feature ───────────────────────────────────────────
import 'package:mobile/features/planner/data/dataSources/planner_remote_data_source.dart';
import 'package:mobile/features/planner/data/repositories/planner_repository_impl.dart';
import 'package:mobile/features/planner/domain/repositories/planner_repository.dart';
import 'package:mobile/features/planner/domain/usecases/generate_itinerary_usecase.dart';
import 'package:mobile/features/planner/domain/usecases/save_itinerary_usecase.dart';
import 'package:mobile/features/planner/presentation/bloc/planner_bloc.dart';

// ── Feed Feature ──────────────────────────────────────────────
import 'package:mobile/features/feed/data/dataSources/feed_remote_data_source.dart';
import 'package:mobile/features/feed/data/repositories/feed_repository_impl.dart';
import 'package:mobile/features/feed/domain/repositories/feed_repository.dart';
import 'package:mobile/features/feed/domain/usecases/get_posts_usecase.dart';
import 'package:mobile/features/feed/domain/usecases/create_post_usecase.dart';
import 'package:mobile/features/feed/domain/usecases/toggle_like_usecase.dart';
import 'package:mobile/features/feed/presentation/bloc/feed_bloc.dart';

// ── Packages Feature ──────────────────────────────────────────
import 'package:mobile/features/packages/data/dataSources/package_remote_data_source.dart';
import 'package:mobile/features/packages/data/repositories/package_repository_impl.dart';
import 'package:mobile/features/packages/domain/repositories/package_repository.dart';
import 'package:mobile/features/packages/domain/usecases/get_packages_feed_usecase.dart';
import 'package:mobile/features/packages/domain/usecases/get_package_detail_usecase.dart';
import 'package:mobile/features/packages/domain/usecases/get_my_packages_usecase.dart';
import 'package:mobile/features/packages/domain/usecases/submit_review_usecase.dart';
import 'package:mobile/features/packages/presentation/bloc/package_bloc.dart';

final sl = GetIt.instance;

Future<void> init() async {
  // ══════════════════════════════════════════════════════════════
  //  EXTERNAL DEPENDENCIES
  // ══════════════════════════════════════════════════════════════

  final sharedPreferences = await SharedPreferences.getInstance();
  sl.registerLazySingleton<SharedPreferences>(() => sharedPreferences);

  sl.registerLazySingleton<InternetConnectionChecker>(
    () => InternetConnectionChecker.instance,
  );

  // ══════════════════════════════════════════════════════════════
  //  CORE
  // ══════════════════════════════════════════════════════════════

  sl.registerLazySingleton<NetworkInfo>(
    () => NetworkInfoImpl(sl<InternetConnectionChecker>()),
  );

  sl.registerLazySingleton<ApiClient>(
    () => ApiClient(sharedPreferences: sl<SharedPreferences>()),
  );

  // ══════════════════════════════════════════════════════════════
  //  AUTH FEATURE
  // ══════════════════════════════════════════════════════════════

  // ── Data Sources ──────────────────────────────────────────────

  sl.registerLazySingleton<AuthRemoteDataSource>(
    () => AuthRemoteDataSourceImpl(apiClient: sl<ApiClient>()),
  );

  sl.registerLazySingleton<AuthLocalDataSource>(
    () => AuthLocalDataSoureImpl(sharedPreferences: sl<SharedPreferences>()),
  );

  // ── Repository ────────────────────────────────────────────────

  sl.registerLazySingleton<AuthRepository>(
    () => AuthRepositoryImpl(
      remoteDataSource: sl<AuthRemoteDataSource>(),
      localDataSource: sl<AuthLocalDataSource>(),
    ),
  );

  // ── Use Cases ─────────────────────────────────────────────────

  sl.registerLazySingleton(() => LogInUsecase(sl<AuthRepository>()));
  sl.registerLazySingleton(() => SignUpUsecase(sl<AuthRepository>()));
  sl.registerLazySingleton(() => LogOutUsecase(sl<AuthRepository>()));
  sl.registerLazySingleton(
    () => SendPasswordResetEmailUsecase(sl<AuthRepository>()),
  );
  sl.registerLazySingleton(
    () => SignInWithGoogleUsecase(sl<AuthRepository>()),
  );

  // ── BLoC ──────────────────────────────────────────────────────

  sl.registerFactory(
    () => AuthBloc(
      logInUsecase: sl<LogInUsecase>(),
      signUpUsecase: sl<SignUpUsecase>(),
      logOutUsecase: sl<LogOutUsecase>(),
      sendPasswordResetEmailUsecase: sl<SendPasswordResetEmailUsecase>(),
      signInWithGoogleUsecase: sl<SignInWithGoogleUsecase>(),
      authRepository: sl<AuthRepository>(),
    ),
  );

  // ══════════════════════════════════════════════════════════════
  //  PACKAGES FEATURE
  // ══════════════════════════════════════════════════════════════

  // ── Data Sources ──────────────────────────────────────────────

  sl.registerLazySingleton<PackageRemoteDataSource>(
    () => PackageRemoteDataSourceImpl(apiClient: sl<ApiClient>()),
  );

  // ── Repository ────────────────────────────────────────────────

  sl.registerLazySingleton<PackageRepository>(
    () => PackageRepositoryImpl(remoteDataSource: sl<PackageRemoteDataSource>()),
  );

  // ── Use Cases ─────────────────────────────────────────────────

  sl.registerLazySingleton(() => GetPackagesFeedUsecase(sl<PackageRepository>()));
  sl.registerLazySingleton(() => GetPackageDetailUsecase(sl<PackageRepository>()));
  sl.registerLazySingleton(() => GetMyPackagesUsecase(sl<PackageRepository>()));
  sl.registerLazySingleton(() => SubmitReviewUsecase(sl<PackageRepository>()));

  // ── BLoC ──────────────────────────────────────────────────────

  sl.registerFactory(
    () => PackageBloc(
      getPackagesFeedUsecase: sl<GetPackagesFeedUsecase>(),
      getPackageDetailUsecase: sl<GetPackageDetailUsecase>(),
      getMyPackagesUsecase: sl<GetMyPackagesUsecase>(),
      submitReviewUsecase: sl<SubmitReviewUsecase>(),
      packageRepository: sl<PackageRepository>(),
    ),
  );

  // ══════════════════════════════════════════════════════════════
  //  FEED FEATURE
  // ══════════════════════════════════════════════════════════════

  // ── Data Sources ──────────────────────────────────────────────

  sl.registerLazySingleton<FeedRemoteDataSource>(
    () => FeedRemoteDataSourceImpl(apiClient: sl<ApiClient>()),
  );

  // ── Repository ────────────────────────────────────────────────

  sl.registerLazySingleton<FeedRepository>(
    () => FeedRepositoryImpl(remoteDataSource: sl<FeedRemoteDataSource>()),
  );

  // ── Use Cases ─────────────────────────────────────────────────

  sl.registerLazySingleton(() => GetPostsUsecase(sl<FeedRepository>()));
  sl.registerLazySingleton(() => CreatePostUsecase(sl<FeedRepository>()));
  sl.registerLazySingleton(() => ToggleLikeUsecase(sl<FeedRepository>()));

  // ── BLoC ──────────────────────────────────────────────────────

  sl.registerFactory(
    () => FeedBloc(
      getPostsUsecase: sl<GetPostsUsecase>(),
      createPostUsecase: sl<CreatePostUsecase>(),
      toggleLikeUsecase: sl<ToggleLikeUsecase>(),
    ),
  );

  // ══════════════════════════════════════════════════════════════
  //  PROFILE FEATURE
  // ══════════════════════════════════════════════════════════════

  // ── Data Sources ──────────────────────────────────────────────

  sl.registerLazySingleton<ProfileRemoteDataSource>(
    () => ProfileRemoteDataSourceImpl(apiClient: sl<ApiClient>()),
  );

  // ── Repository ────────────────────────────────────────────────

  sl.registerLazySingleton<ProfileRepository>(
    () => ProfileRepositoryImpl(remoteDataSource: sl<ProfileRemoteDataSource>()),
  );

  // ── Use Cases ─────────────────────────────────────────────────

  sl.registerLazySingleton(() => GetProfileUsecase(sl<ProfileRepository>()));
  sl.registerLazySingleton(() => UpdateProfileUsecase(sl<ProfileRepository>()));
  sl.registerLazySingleton(() => ChangePasswordUsecase(sl<ProfileRepository>()));

  // ── BLoC ──────────────────────────────────────────────────────

  sl.registerFactory(
    () => ProfileBloc(
      getProfileUsecase: sl<GetProfileUsecase>(),
      updateProfileUsecase: sl<UpdateProfileUsecase>(),
      changePasswordUsecase: sl<ChangePasswordUsecase>(),
    ),
  );

  // ══════════════════════════════════════════════════════════════
  //  PLANNER FEATURE
  // ══════════════════════════════════════════════════════════════

  // ── Data Sources ──────────────────────────────────────────────

  sl.registerLazySingleton<PlannerRemoteDataSource>(
    () => PlannerRemoteDataSourceImpl(apiClient: sl<ApiClient>()),
  );

  // ── Repository ────────────────────────────────────────────────

  sl.registerLazySingleton<PlannerRepository>(
    () => PlannerRepositoryImpl(remoteDataSource: sl<PlannerRemoteDataSource>()),
  );

  // ── Use Cases ─────────────────────────────────────────────────

  sl.registerLazySingleton(() => GenerateItineraryUsecase(sl<PlannerRepository>()));
  sl.registerLazySingleton(() => SaveItineraryUsecase(sl<PlannerRepository>()));

  // ── BLoC ──────────────────────────────────────────────────────

  sl.registerFactory(
    () => PlannerBloc(
      generateItineraryUsecase: sl<GenerateItineraryUsecase>(),
      saveItineraryUsecase: sl<SaveItineraryUsecase>(),
      plannerRepository: sl<PlannerRepository>(),
    ),
  );
}
