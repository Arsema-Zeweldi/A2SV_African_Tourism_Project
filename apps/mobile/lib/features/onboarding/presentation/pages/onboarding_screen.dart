// TODO: Replace this placeholder with the real Onboarding screen.
// Dawit's PR #26 (branch: Dawit_Branch) has the real implementation.
// Once that PR is merged and conflicts resolved, this file gets replaced.
//
// CONTRACT — Your screen must:
//   1. Keep the class name: OnboardingScreen
//   2. Keep the file at this exact path
//   3. On "Get Started" or "Skip", navigate to login:
//        context.go('/login')
//   4. Optionally save a flag so onboarding is only shown once:
//        SharedPreferences → set 'HAS_SEEN_ONBOARDING' = true

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/core/constants/app_colors.dart';

class OnboardingScreen extends StatelessWidget {
  const OnboardingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.scaffoldBackground,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Spacer(),
              Image.asset(
                'assets/images/logo&name.png',
                height: 50,
              ),
              const SizedBox(height: 40),
              const Text(
                'Discover the\nHeart of Africa',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                  color: AppColors.primaryDark,
                  height: 1.2,
                ),
              ),
              const SizedBox(height: 16),
              Text(
                'Find curated packages and join a vibrant community of travelers exploring the continent\'s hidden gems.',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 15,
                  color: Colors.grey.shade600,
                  height: 1.5,
                ),
              ),
              const Spacer(),
              ElevatedButton(
                onPressed: () => context.go('/login'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primaryOrange,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(28),
                  ),
                ),
                child: const Text(
                  'Get Started',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ),
              const SizedBox(height: 12),
              OutlinedButton(
                onPressed: () => context.go('/login'),
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  side: const BorderSide(color: AppColors.primaryOrange),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(28),
                  ),
                ),
                child: const Text(
                  'Login',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: AppColors.primaryOrange,
                  ),
                ),
              ),
              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }
}
