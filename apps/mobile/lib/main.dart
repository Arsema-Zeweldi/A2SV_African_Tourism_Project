import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile/core/constants/app_colors.dart';
import 'package:mobile/core/router/app_router.dart';
import 'package:mobile/features/auth/presentation/bloc/auth_bloc.dart';
import 'package:mobile/features/auth/presentation/bloc/auth_event.dart';
import 'package:mobile/features/packages/presentation/bloc/package_bloc.dart';
import 'package:mobile/features/packages/presentation/bloc/package_event.dart';
import 'package:mobile/features/feed/presentation/bloc/feed_bloc.dart';
import 'package:mobile/features/feed/presentation/bloc/feed_event.dart';
import 'package:mobile/features/planner/presentation/bloc/planner_bloc.dart';
import 'package:mobile/features/profile/presentation/bloc/profile_bloc.dart';
import 'package:mobile/features/profile/presentation/bloc/profile_event.dart';
import 'package:mobile/injection_container.dart' as di;

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize all dependencies (SharedPreferences, ApiClient, BLoC, etc.)
  await di.init();

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    // Create the AuthBloc from the DI container and immediately check
    // if the user has an existing session (cached token/user).
    final authBloc = di.sl<AuthBloc>()..add(CheckAuthStatusRequested());

    return MultiBlocProvider(
      providers: [
        BlocProvider<AuthBloc>(create: (_) => authBloc),
        BlocProvider<PackageBloc>(
          create: (_) => di.sl<PackageBloc>()..add(const LoadPackagesFeed(sortBy: 'rating_avg', order: 'desc')),
        ),
        BlocProvider<FeedBloc>(
          create: (_) => di.sl<FeedBloc>()..add(const LoadPosts()),
        ),
        BlocProvider<PlannerBloc>(
          create: (_) => di.sl<PlannerBloc>(),
        ),
        BlocProvider<ProfileBloc>(
          create: (_) => di.sl<ProfileBloc>()..add(const LoadProfile()),
        ),
      ],
      child: Builder(
        builder: (context) {
          // GoRouter is created here so it can reference the AuthBloc
          // for redirect logic (e.g., send unauthenticated users to login).
          final router = createRouter(context.read<AuthBloc>());

          return MaterialApp.router(
            routerConfig: router,
            theme: ThemeData(
              scaffoldBackgroundColor: AppColors.scaffoldBackground,
              colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
              useMaterial3: true,
              textButtonTheme: TextButtonThemeData(
                style: TextButton.styleFrom(enableFeedback: false),
              ),
              elevatedButtonTheme: ElevatedButtonThemeData(
                style: ElevatedButton.styleFrom(enableFeedback: false),
              ),
              outlinedButtonTheme: OutlinedButtonThemeData(
                style: OutlinedButton.styleFrom(enableFeedback: false),
              ),
              iconButtonTheme: IconButtonThemeData(
                style: IconButton.styleFrom(enableFeedback: false),
              ),
            ),
            debugShowCheckedModeBanner: false,
          );
        },
      ),
    );
  }
}
