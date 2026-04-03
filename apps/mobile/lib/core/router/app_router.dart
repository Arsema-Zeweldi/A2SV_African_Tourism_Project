import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/features/auth/presentation/bloc/auth_bloc.dart';
import 'package:mobile/features/auth/presentation/bloc/auth_state.dart';
import 'package:mobile/features/auth/presentation/pages/forgot_password_screen.dart';
import 'package:mobile/features/auth/presentation/pages/login_screen.dart';
import 'package:mobile/features/auth/presentation/pages/signup_screen.dart';
import 'package:mobile/features/market_place/presentation/pages/package_detail_page.dart';
import 'package:mobile/features/onboarding/presentation/pages/onboarding_screen.dart';
import 'package:mobile/features/packages/domain/entities/package_entity.dart';
import 'package:mobile/features/plan_trip/presentation/pages/plan_trip_screen.dart';
import 'package:mobile/features/profile/presentation/pages/edit_profile_screen.dart';
import 'package:mobile/features/profile/presentation/pages/profile_page.dart';
import 'package:mobile/features/post/presentation/pages/new_post_screen.dart';
import 'package:mobile/features/generated_itinerary/presentation/pages/itinerary_result_screen.dart';
import 'package:mobile/features/chat/presentation/bloc/chat_bloc.dart';
import 'package:mobile/features/chat/presentation/pages/package_chat_screen.dart';
import 'package:mobile/injection_container.dart';
import 'package:mobile/main_screen.dart';

/// Creates and configures the app's GoRouter instance.
///
/// Auth redirect logic:
///   - If user is NOT authenticated → redirect to /login
///   - If user IS authenticated and tries to visit auth pages → redirect to /app
///   - First launch (no cached session) → /onboarding
GoRouter createRouter(AuthBloc authBloc) {
  return GoRouter(
    initialLocation: '/',
    debugLogDiagnostics: true,
    refreshListenable: _AuthBlocRefreshStream(authBloc),
    redirect: (context, state) {
      final authState = authBloc.state;
      final isOnAuthPage = state.matchedLocation == '/login' ||
          state.matchedLocation == '/signup' ||
          state.matchedLocation == '/forgot-password' ||
          state.matchedLocation == '/onboarding';

      // Still loading — don't redirect yet.
      if (authState is AuthInitial || authState is AuthLoading) {
        return null;
      }

      final isAuthenticated = authState is Authenticated;

      // Not logged in and NOT on an auth page → send to onboarding.
      if (!isAuthenticated && !isOnAuthPage) {
        return '/onboarding';
      }

      // Logged in but still on an auth page → send to main app.
      if (isAuthenticated && isOnAuthPage) {
        return '/app';
      }

      // Logged in, visiting root → send to main app.
      if (isAuthenticated && state.matchedLocation == '/') {
        return '/app';
      }

      return null; // No redirect needed.
    },
    routes: [
      // ─── Root (only used for redirect logic) ─────────────────────
      GoRoute(
        path: '/',
        builder: (context, state) => const Scaffold(
          body: Center(child: CircularProgressIndicator()),
        ),
      ),

      // ─── Auth Flow ───────────────────────────────────────────────
      GoRoute(
        path: '/onboarding',
        builder: (context, state) => const OnboardingScreen(),
      ),
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/signup',
        builder: (context, state) => const SignUpScreen(),
      ),
      GoRoute(
        path: '/forgot-password',
        builder: (context, state) => const ForgotPasswordScreen(),
      ),

      // ─── Main App (bottom navigation) ────────────────────────────
      GoRoute(
        path: '/app',
        builder: (context, state) => const MainScreen(),
      ),

      // ─── Screens pushed on top of the main app ───────────────────
      GoRoute(
        path: '/plan-trip',
        builder: (context, state) => const PlanTripScreen(),
      ),
      GoRoute(
        path: '/profile',
        builder: (context, state) => const ProfilePage(),
      ),
      GoRoute(
        path: '/edit-profile',
        builder: (context, state) => const EditProfileScreen(),
      ),
      GoRoute(
        path: '/new-post',
        builder: (context, state) => const NewPostScreen(),
      ),
      GoRoute(
        path: '/itinerary-result',
        builder: (context, state) => const ItineraryResultScreen(),
      ),

      GoRoute(
        path: '/package-detail',
        builder: (context, state) {
          final package = state.extra as TravelPackage;
          return PackageDetailPage(
            packageId: package.id,
            title: package.title,
            location: package.location.isNotEmpty
                ? package.location
                : package.country,
            price: package.price.toStringAsFixed(0),
            rating: package.ratingAvg.toStringAsFixed(1),
            reviewsCount: package.reviewsCount.toString(),
            duration: '${package.durationDays} Days',
            groupType:
                package.groupSize.isNotEmpty ? package.groupSize : 'All Ages',
            category: package.category.isNotEmpty ? package.category : 'Travel',
            description: package.description.isNotEmpty
                ? package.description
                : package.summary,
            imageUrl: package.imageUrl,
            imagePath: null,
          );
        },
      ),

      // ─── Package Chat ──────────────────────────────────────────────
      GoRoute(
        path: '/package-chat/:packageId',
        builder: (context, state) {
          final packageId = state.pathParameters['packageId']!;
          final packageTitle = state.extra as String? ?? 'Package Chat';
          return BlocProvider(
            create: (_) => sl<ChatBloc>(),
            child: PackageChatScreen(
              packageId: packageId,
              packageTitle: packageTitle,
            ),
          );
        },
      ),
    ],
  );
}

/// Converts the AuthBloc stream into a [ChangeNotifier] so GoRouter
/// can listen to auth state changes and re-evaluate redirects.
class _AuthBlocRefreshStream extends ChangeNotifier {
  late final StreamSubscription<AuthState> _subscription;

  _AuthBlocRefreshStream(AuthBloc bloc) {
    _subscription = bloc.stream.listen((_) {
      notifyListeners();
    });
  }

  @override
  void dispose() {
    _subscription.cancel();
    super.dispose();
  }
}
