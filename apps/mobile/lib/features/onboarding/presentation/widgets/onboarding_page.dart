import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../core/constants/colors.dart';

class OnboardingPage extends StatelessWidget {
  final String title;
  final String description;
  final String? image;
  final String? backgroundImage;
  final bool isLastPage;

  const OnboardingPage({
    super.key,
    required this.title,
    required this.description,
    this.image,
    this.backgroundImage,
    this.isLastPage = false,
  });

  @override
  Widget build(BuildContext context) {
    if (backgroundImage != null) {
      return _buildBackgroundMode(context);
    } else {
      return _buildStandardMode(context);
    }
  }

  Widget _buildBackgroundMode(BuildContext context) {
    return Stack(
      children: [
        Positioned.fill(
          child: Image.asset(
            backgroundImage!,
            fit: BoxFit.cover,
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 0.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.end,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SizedBox(
                width: MediaQuery.of(context).size.width * 0.8,
                child: Text(
                  title,
                  textAlign: TextAlign.left,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 48,
                    fontWeight: FontWeight.w800,
                    color: Colors.white,
                    letterSpacing: -1.0,
                    height: 1.1,
                    shadows: [
                      Shadow(
                        color: Colors.white.withOpacity(0.4),
                        blurRadius: 10,
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 18),
              SizedBox(
                width: MediaQuery.of(context).size.width * 0.75,
                child: Text(
                  description,
                  textAlign: TextAlign.left,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 18,
                    fontWeight: FontWeight.w400,
                    color: Colors.white.withOpacity(0.9),
                    height: 29.3 / 18.0,
                    letterSpacing: 0,
                    shadows: [
                      Shadow(
                        color: Colors.white.withOpacity(0.4),
                        blurRadius: 6,
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 160), // Space for indicator and buttons
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildStandardMode(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          const SizedBox(height: 100), // Space for header
          if (image != null) ...[
            Container(
              height: MediaQuery.of(context).size.height * 0.42,
              width: double.infinity,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(40),
                image: DecorationImage(
                  image: AssetImage(image!),
                  fit: BoxFit.cover,
                ),
              ),
            ),
            const SizedBox(height: 48),
          ],
          FittedBox(
            fit: BoxFit.scaleDown,
            child: Text(
              title,
              textAlign: TextAlign.center,
              style: GoogleFonts.plusJakartaSans(
                fontSize: 32,
                fontWeight: FontWeight.w800,
                color: AppColors.textPrimary,
                letterSpacing: -1.0,
                height: 1.2,
              ),
            ),
          ),
          const SizedBox(height: 16),
          Text(
            description,
            textAlign: TextAlign.center,
            style: GoogleFonts.plusJakartaSans(
              fontSize: 18,
              fontWeight: FontWeight.w400,
              color: AppColors.textSecondary,
              height: 29.3 / 18.0,
              letterSpacing: 0,
            ),
          ),
        ],
      ),
    );
  }
}
