import 'package:flutter/material.dart';
import '../../widgets/app_bar.dart';
import '../../widgets/auth_text_field.dart';
import '../../widgets/glass_card.dart';
import '../../widgets/google_button.dart';
import '../../widgets/or_driver.dart';
import '../../widgets/orange_button.dart';
import '../../widgets/savennabg.dart';
import '../plan_your_trip/plan_your_trip_1.dart';
import 'login_screen.dart';

class SignUpScreen extends StatelessWidget {
  const SignUpScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SavannaBg(
        child: SafeArea(
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const AmoniAppBar(),
                const SizedBox(height: 24),
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Begin Your',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 36,
                          fontWeight: FontWeight.w800,
                          height: 1.1,
                        ),
                      ),
                      Text(
                        'Adventure',
                        style: TextStyle(
                          color: Color(0xFFE8781A),
                          fontSize: 36,
                          fontWeight: FontWeight.w800,
                          fontStyle: FontStyle.italic,
                          height: 1.1,
                        ),
                      ),
                      SizedBox(height: 10),
                      Text(
                        'Discover curated African\nexperiences and connect with\nfellow travelers.',
                        style: TextStyle(
                          color: Colors.white70,
                          fontSize: 13,
                          height: 1.5,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 28),
                GlassCard(
                  child: Column(
                    children: [
                      const AuthTextField(
                        label: 'FULL NAME',
                        hint: 'Kofi Mensah',
                        prefixIcon: Icons.person_outline,
                      ),
                      const SizedBox(height: 16),
                      const AuthTextField(
                        label: 'EMAIL ADDRESS',
                        hint: 'kofi@safari.com',
                        prefixIcon: Icons.mail_outline,
                      ),
                      const SizedBox(height: 16),
                      const AuthTextField(
                        label: 'PASSWORD',
                        hint: '••••••••',
                        prefixIcon: Icons.lock_outline,
                        isPassword: true,
                      ),
                      const SizedBox(height: 22),
                      OrangeButton(
                        label: 'Create Account',
                        onTap: () => Navigator.pushAndRemoveUntil(
                          context,
                          MaterialPageRoute(
                              builder: (_) => const PlanTripStep1Screen()),
                              (route) => false,
                        ),
                      ),
                      const OrDivider(),
                      const GoogleButton(),
                      const SizedBox(height: 16),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Text(
                            'Already part of the tribe? ',
                            style: TextStyle(
                                color: Color(0xFF6B5B3E), fontSize: 13),
                          ),
                          GestureDetector(
                            onTap: () => Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: (_) => const LoginScreen()),
                            ),
                            child: const Text(
                              'Log in',
                              style: TextStyle(
                                color: Color(0xFFE8781A),
                                fontSize: 13,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 30),
                  child: Text(
                    'By signing up, you agree to our Terms of Service and Privacy Policy. We will respect your journey.',
                    style: TextStyle(
                      color: Colors.white38,
                      fontSize: 10,
                      height: 1.5,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),
                const SizedBox(height: 24),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
