import 'package:amona/screens/auth/change_password.dart';
import 'package:amona/screens/plan_your_trip/plan_your_trip_1.dart';
import 'package:amona/widgets/app_bar.dart';
import 'package:amona/widgets/savennabg.dart';
import 'package:flutter/material.dart';

import 'change_password.dart';

class LoginScreen extends StatelessWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: false,
      body: SavannaBg(
        child: SafeArea(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const AmoniAppBar(),
              const SizedBox(height: 16),
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(
                          'Welcome ',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 28,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                        Text(
                          'Back',
                          style: TextStyle(
                            color: Color(0xFFE8781A),
                            fontSize: 28,
                            fontWeight: FontWeight.w800,
                            fontStyle: FontStyle.italic,
                          ),
                        ),
                      ],
                    ),
                    SizedBox(height: 4),
                    Text(
                      'Log in to continue your journey across the continent.',
                      style: TextStyle(
                        color: Colors.white70,
                        fontSize: 12,
                        height: 1.4,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              Container(
                margin: const EdgeInsets.symmetric(horizontal: 20),
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.92),
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.15),
                      blurRadius: 30,
                      offset: const Offset(0, 10),
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    // Email field
                    _compactField(
                      label: 'EMAIL ADDRESS',
                      hint: 'your@email.com',
                      icon: Icons.mail_outline,
                    ),
                    const SizedBox(height: 12),
                    // Password label + forgot row
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'PASSWORD',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w700,
                            letterSpacing: 1.2,
                            color: Color(0xFF6B5B3E),
                          ),
                        ),
                        GestureDetector(
                          onTap: () =>
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                    builder: (
                                        _) => const ChangePasswordScreen()),
                              ),
                          child: const Text(
                            'Forgot?',
                            style: TextStyle(
                              fontSize: 11,
                              color: Color(0xFFE8781A),
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    _compactPasswordField(),
                    const SizedBox(height: 16),
                    // Login button
                    GestureDetector(
                      onTap: () =>
                          Navigator.pushAndRemoveUntil(
                            context,
                            MaterialPageRoute(
                                builder: (_) => const PlanTripStep1Screen()),
                                (route) => false,
                          ),
                      child: Container(
                        width: double.infinity,
                        height: 46,
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [Color(0xFFE8781A), Color(0xFFD4621A)],
                          ),
                          borderRadius: BorderRadius.circular(12),
                          boxShadow: [
                            BoxShadow(
                              color: const Color(0xFFE8781A).withOpacity(0.35),
                              blurRadius: 12,
                              offset: const Offset(0, 5),
                            ),
                          ],
                        ),
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text('Login',
                                style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 14,
                                    fontWeight: FontWeight.w700)),
                            SizedBox(width: 6),
                            Icon(Icons.arrow_forward,
                                color: Colors.white, size: 16),
                          ],
                        ),
                      ),
                    ),
                    // Divider
                    Padding(
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      child: Row(
                        children: [
                          Expanded(
                              child: Divider(
                                  color: const Color(0xFFD4C4A8)
                                      .withOpacity(0.6))),
                          const Padding(
                            padding: EdgeInsets.symmetric(horizontal: 10),
                            child: Text('Or join with',
                                style: TextStyle(
                                    fontSize: 11,
                                    color: Color(0xFF9E8A70))),
                          ),
                          Expanded(
                              child: Divider(
                                  color: const Color(0xFFD4C4A8)
                                      .withOpacity(0.6))),
                        ],
                      ),
                    ),
                    // Google button
                    Container(
                      width: double.infinity,
                      height: 44,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                            color: const Color(0xFFE0D5C5), width: 1.5),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Container(
                            width: 18,
                            height: 18,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(
                                  color: const Color(0xFF4285F4)
                                      .withOpacity(0.3)),
                            ),
                            child: const Center(
                                child: Text('G',
                                    style: TextStyle(
                                        color: Color(0xFF4285F4),
                                        fontSize: 11,
                                        fontWeight: FontWeight.w700))),
                          ),
                          const SizedBox(width: 8),
                          const Text('Sign in with Google',
                              style: TextStyle(
                                  color: Color(0xFF4A3728),
                                  fontSize: 13,
                                  fontWeight: FontWeight.w600)),
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text('New to the tribe? ',
                            style: TextStyle(
                                color: Color(0xFF6B5B3E), fontSize: 12)),
                        GestureDetector(
                          onTap: () => Navigator.pop(context),
                          child: const Text('Sign Up',
                              style: TextStyle(
                                  color: Color(0xFFE8781A),
                                  fontSize: 12,
                                  fontWeight: FontWeight.w700)),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const Spacer(),
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 30, vertical: 12),
                child: Text(
                  'By continuing, you agree to our Terms of Service and Privacy Policy.',
                  style: TextStyle(
                      color: Colors.white38, fontSize: 10, height: 1.4),
                  textAlign: TextAlign.center,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _compactField({required String label,
    required String hint,
    required IconData icon}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label,
            style: const TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.w700,
                letterSpacing: 1.2,
                color: Color(0xFF6B5B3E))),
        const SizedBox(height: 5),
        Container(
          height: 44,
          decoration: BoxDecoration(
            color: const Color(0xFFF5F0E8),
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: const Color(0xFFE8D5B0)),
          ),
          child: Row(
            children: [
              const SizedBox(width: 12),
              Icon(icon, color: const Color(0xFF9E8A70), size: 16),
              const SizedBox(width: 8),
              Text(hint,
                  style: TextStyle(
                      color: const Color(0xFF9E8A70).withOpacity(0.7),
                      fontSize: 13)),
            ],
          ),
        ),
      ],
    );
  }

  Widget _compactPasswordField() {
    return Container(
      height: 44,
      decoration: BoxDecoration(
        color: const Color(0xFFF5F0E8),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: const Color(0xFFE8D5B0)),
      ),
      child: Row(
        children: [
          const SizedBox(width: 12),
          const Icon(Icons.lock_outline,
              color: Color(0xFF9E8A70), size: 16),
          const SizedBox(width: 8),
          Expanded(
            child: TextField(
              obscureText: true,
              style:
              const TextStyle(fontSize: 13, color: Color(0xFF3D2B1A)),
              decoration: InputDecoration(
                hintText: '••••••••',
                hintStyle: TextStyle(
                    color: const Color(0xFF9E8A70).withOpacity(0.7),
                    fontSize: 13),
                border: InputBorder.none,
                contentPadding:
                const EdgeInsets.symmetric(vertical: 12),
                suffixIcon: const Icon(Icons.visibility_off_outlined,
                    color: Color(0xFF9E8A70), size: 16),
              ),
            ),
          ),
        ],
      ),
    );
  }
}