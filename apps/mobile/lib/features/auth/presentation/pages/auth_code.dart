import 'package:mobile/features/auth/presentation/pages/new_password.dart';
import 'package:mobile/core/widgets/malak/app_bar.dart';
import 'package:mobile/core/widgets/malak/glass_card.dart';
import 'package:mobile/core/widgets/malak/orange_button.dart';
import 'package:mobile/core/widgets/malak/savennabg.dart';
import 'package:flutter/material.dart';

import 'new_password.dart';

const String _correctCode = '1234'; // Demo code — replace with real logic

class AuthCodeScreen extends StatefulWidget {
  const AuthCodeScreen({super.key});

  @override
  State<AuthCodeScreen> createState() => _AuthCodeScreenState();
}

class _AuthCodeScreenState extends State<AuthCodeScreen> {
  final List<TextEditingController> _controllers =
  List.generate(4, (_) => TextEditingController());
  final List<FocusNode> _focusNodes = List.generate(4, (_) => FocusNode());

  void _onChanged(String value, int index) {
    if (value.length == 1 && index < 3) {
      _focusNodes[index + 1].requestFocus();
    }
    if (value.isEmpty && index > 0) {
      _focusNodes[index - 1].requestFocus();
    }
  }

  void _verify() {
    final entered = _controllers.map((c) => c.text).join();
    if (entered.length < 4) {
      _showAlert('Incomplete Code', 'Please enter all 4 digits of your code.');
      return;
    }
    if (entered == _correctCode) {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (_) => NewPasswordScreen()),
      );
    } else {
      // Clear fields on wrong code
      for (final c in _controllers)
        c.clear();
      _focusNodes[0].requestFocus();
      _showAlert('Invalid Code',
          'The code you entered is incorrect. Please check your email and try again.');
    }
  }

  void _showAlert(String title, String message) {
    showDialog(
      context: context,
      builder: (_) =>
          AlertDialog(
            shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20)),
            backgroundColor: Colors.white,
            title: Row(
              children: [
                Container(
                  width: 32,
                  height: 32,
                  decoration: const BoxDecoration(
                    color: Color(0xFFFFF0E0),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.warning_amber_rounded,
                      color: Color(0xFFE8781A), size: 18),
                ),
                const SizedBox(width: 10),
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF3D2B1A),
                  ),
                ),
              ],
            ),
            content: Text(
              message,
              style: const TextStyle(
                color: Color(0xFF6B5B3E),
                fontSize: 13,
                height: 1.5,
              ),
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context),
                child: const Text(
                  'Try Again',
                  style: TextStyle(
                    color: Color(0xFFE8781A),
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ],
          ),
    );
  }

  @override
  void dispose() {
    for (final c in _controllers)
      c.dispose();
    for (final f in _focusNodes)
      f.dispose();
    super.dispose();
  }

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
                const SizedBox(height: 32),
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Verify',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 36,
                          fontWeight: FontWeight.w800,
                          height: 1.1,
                        ),
                      ),
                      Text(
                        'Your Code',
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
                        'Enter the 4-digit code we sent\nto your email address.',
                        style: TextStyle(
                          color: Colors.white70,
                          fontSize: 13,
                          height: 1.5,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 40),
                GlassCard(
                  child: Column(
                    children: [
                      // Code icon
                      Container(
                        width: 60,
                        height: 60,
                        decoration: BoxDecoration(
                          color: const Color(0xFFFFF0E0),
                          shape: BoxShape.circle,
                          border: Border.all(
                              color: const Color(0xFFE8781A).withOpacity(0.3),
                              width: 2),
                        ),
                        child: const Icon(Icons.mark_email_read_outlined,
                            color: Color(0xFFE8781A), size: 28),
                      ),
                      const SizedBox(height: 20),
                      const Text(
                        'AUTHENTICATION CODE',
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w700,
                          letterSpacing: 1.2,
                          color: Color(0xFF6B5B3E),
                        ),
                      ),
                      const SizedBox(height: 16),
                      // 4-digit OTP boxes
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: List.generate(4, (index) {
                          return SizedBox(
                            width: 58,
                            height: 64,
                            child: Container(
                              decoration: BoxDecoration(
                                color: const Color(0xFFF5F0E8),
                                borderRadius: BorderRadius.circular(14),
                                border: Border.all(
                                    color: const Color(0xFFE8D5B0), width: 1.5),
                              ),
                              child: TextField(
                                controller: _controllers[index],
                                focusNode: _focusNodes[index],
                                textAlign: TextAlign.center,
                                keyboardType: TextInputType.number,
                                maxLength: 1,
                                onChanged: (v) => _onChanged(v, index),
                                style: const TextStyle(
                                  fontSize: 22,
                                  fontWeight: FontWeight.w800,
                                  color: Color(0xFF3D2B1A),
                                ),
                                decoration: const InputDecoration(
                                  border: InputBorder.none,
                                  counterText: '',
                                  contentPadding: EdgeInsets.zero,
                                ),
                              ),
                            ),
                          );
                        }),
                      ),
                      const SizedBox(height: 24),
                      OrangeButton(
                        label: 'Verify Code',
                        onTap: _verify,
                        showArrow: true,
                      ),
                      const SizedBox(height: 16),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Text(
                            "Didn't receive a code? ",
                            style: TextStyle(
                                color: Color(0xFF6B5B3E), fontSize: 13),
                          ),
                          GestureDetector(
                            onTap: () {},
                            child: const Text(
                              'Resend',
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
                const SizedBox(height: 24),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
