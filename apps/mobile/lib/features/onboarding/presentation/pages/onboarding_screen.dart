import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../core/constants/colors.dart';
import '../widgets/custom_indicator.dart';
import '../widgets/onboarding_page.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentIndex = 0;

  final List<Map<String, String>> _pages = [
    {
      'title': 'Discover the Heart of Africa',
      'description':
          'Find curated packages and join a vibrant community of travelers exploring the continent\'s hidden gems.',
      'backgroundImage': 'assets/images/onboarding_bg_1.png',
    },
    {
      'title': 'Connect with the Tribe',
      'description':
          'Share your journey and get real-time tips from fellow explorers across the continent.',
      'image': 'assets/images/onboarding_img_2.png',
    },
    {
      'title': 'Your Trip, Your Way',
      'description':
          'Use our smart planner to tailor your dream itinerary based on your vibe, budget, and climate preference.',
      'image': 'assets/images/onboarding_img_3.png',
    },
  ];

  void _onNext() {
    if (_currentIndex < _pages.length - 1) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    }
  }

  void _onSkip() {
    _pageController.animateToPage(
      _pages.length - 1,
      duration: const Duration(milliseconds: 500),
      curve: Curves.easeInOut,
    );
  }

  @override
  Widget build(BuildContext context) {
    final isLastPage = _currentIndex == _pages.length - 1;
    final hasBgImage = _pages[_currentIndex]['backgroundImage'] != null;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: Stack(
        children: [
          PageView.builder(
            controller: _pageController,
            onPageChanged: (index) {
              setState(() {
                _currentIndex = index;
              });
            },
            itemCount: _pages.length,
            itemBuilder: (context, index) {
              return OnboardingPage(
                title: _pages[index]['title']!,
                description: _pages[index]['description']!,
                image: _pages[index]['image'],
                backgroundImage: _pages[index]['backgroundImage'],
                isLastPage: index == _pages.length - 1,
              );
            },
          ),

          // Header (Logo and Skip)
          SafeArea(
            child: Padding(
              padding:
                  const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Image.asset(
                    'assets/images/amona_logo.png',
                    height: 32,
                  ),
                  if (!isLastPage)
                    Container(
                      decoration: BoxDecoration(
                        color: hasBgImage
                            ? Colors.white.withOpacity(0.1)
                            : Colors.transparent,
                        borderRadius: BorderRadius.circular(30),
                        border: hasBgImage
                            ? Border.all(
                                color: Colors.white.withOpacity(0.2),
                                width: 1.0)
                            : null,
                      ),
                      child: TextButton(
                        onPressed: _onSkip,
                        style: TextButton.styleFrom(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 16, vertical: 4),
                          minimumSize: Size.zero,
                          tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                        ),
                        child: Text(
                          'Skip',
                          style: GoogleFonts.plusJakartaSans(
                            color:
                                hasBgImage ? Colors.white : AppColors.primary,
                            fontSize: 14,
                            fontWeight:
                                hasBgImage ? FontWeight.w800 : FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),

          // Footer (Indicator and Buttons)
          Positioned(
            bottom: 50,
            left: 24,
            right: 24,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                CustomIndicator(
                  count: _pages.length,
                  currentIndex: _currentIndex,
                  alignment: MainAxisAlignment.center,
                  inactiveColor: hasBgImage
                      ? Colors.white.withOpacity(0.5)
                      : AppColors.primary.withOpacity(0.2),
                ),
                const SizedBox(height: 36),
                if (!isLastPage)
                  SizedBox(
                    width: double.infinity,
                    height: 56,
                    child: ElevatedButton(
                      onPressed: _onNext,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(32),
                        ),
                        elevation: 0,
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            'Next',
                            style: GoogleFonts.plusJakartaSans(
                                fontSize: 16, fontWeight: FontWeight.w600),
                          ),
                          const SizedBox(width: 8),
                          const Icon(Icons.arrow_forward, size: 18),
                        ],
                      ),
                    ),
                  ),
                if (isLastPage) ...[
                  SizedBox(
                    width: double.infinity,
                    height: 56,
                    child: ElevatedButton(
                      onPressed: () {}, // TODO: Navigate to Home/Auth
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(28),
                        ),
                        elevation: 0,
                      ),
                      child: const Text(
                        'Get Started',
                        style: TextStyle(
                            fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  SizedBox(
                    width: double.infinity,
                    height: 56,
                    child: OutlinedButton(
                      onPressed: () {}, // TODO: Navigate to Login
                      style: OutlinedButton.styleFrom(
                        foregroundColor: AppColors.textPrimary,
                        side: BorderSide(color: AppColors.indicatorInactive),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(28),
                        ),
                      ),
                      child: const Text(
                        'Login',
                        style: TextStyle(
                            fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}
