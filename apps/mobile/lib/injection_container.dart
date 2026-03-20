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
}
