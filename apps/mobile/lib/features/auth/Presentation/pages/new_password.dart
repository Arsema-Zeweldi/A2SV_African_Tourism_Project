import 'package:amona/widgets/app_bar.dart';
import 'package:amona/widgets/auth_text_field.dart';
import 'package:amona/widgets/glass_card.dart';
import 'package:amona/widgets/orange_button.dart';
import 'package:amona/widgets/savennabg.dart';
import 'package:flutter/material.dart';

import 'login_screen.dart';

class NewPasswordScreen extends StatefulWidget {
  const NewPasswordScreen({super.key});

  @override
  State<NewPasswordScreen> createState() => _NewPasswordScreenState();
}

class _NewPasswordScreenState extends State<NewPasswordScreen> {
  final TextEditingController _newPass = TextEditingController();
  final TextEditingController _confirmPass = TextEditingController();

  void _submit() {
    final p1 = _newPass.text.trim();
    final p2 = _confirmPass.text.trim();

    if (p1.isEmpty || p2.isEmpty) {
      _showAlert('Empty Fields', 'Please fill in both password fields.');
      return;
    }
    if (p1.length < 6) {
      _showAlert(
          'Too Short', 'Password must be at least 6 characters long.');
      return;
    }
    if (p1 != p2) {
      _showAlert('Passwords Don\'t Match',
          'The passwords you entered do not match. Please try again.');
      return;
    }

    // Success — navigate back to login
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        backgroundColor: Colors.white,
        title: Row(
          children: [
            Container(
              width: 32,
              height: 32,
              decoration: const BoxDecoration(
                color: Color(0xFFE8F5E9),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.check_circle_outline,
                  color: Color(0xFF4CAF50), size: 18),
            ),
            const SizedBox(width: 10),
            const Text(
              'Password Updated!',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w700,
                color: Color(0xFF3D2B1A),
              ),
            ),
          ],
        ),
        content: const Text(
          'Your password has been changed successfully. You can now log in with your new password.',
          style: TextStyle(
            color: Color(0xFF6B5B3E),
            fontSize: 13,
            height: 1.5,
          ),
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              Navigator.pushAndRemoveUntil(
                context,
                MaterialPageRoute(builder: (_) => const LoginScreen()),
                    (route) => false,
              );
            },
            child: const Text(
              'Go to Login',
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

  void _showAlert(String title, String message) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
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
              'OK',
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
    _newPass.dispose();
    _confirmPass.dispose();
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
                        'New',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 36,
                          fontWeight: FontWeight.w800,
                          height: 1.1,
                        ),
                      ),
                      Text(
                        'Password',
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
                        'Create a strong new password\nto secure your account.',
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
                      AuthTextField(
                        label: 'NEW PASSWORD',
                        hint: '••••••••',
                        prefixIcon: Icons.lock_outline,
                        isPassword: true,
                        controller: _newPass,
                      ),
                      const SizedBox(height: 16),
                      AuthTextField(
                        label: 'CONFIRM PASSWORD',
                        hint: '••••••••',
                        prefixIcon: Icons.lock_reset_outlined,
                        isPassword: true,
                        controller: _confirmPass,
                      ),
                      const SizedBox(height: 10),
                      // Password hint
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFFF8F0),
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(
                              color: const Color(0xFFE8D5B0), width: 1),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.info_outline,
                                color: Color(0xFFE8781A), size: 14),
                            const SizedBox(width: 8),
                            const Expanded(
                              child: Text(
                                'Password must be at least 6 characters long.',
                                style: TextStyle(
                                  color: Color(0xFF9E8A70),
                                  fontSize: 11,
                                  height: 1.4,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 22),
                      OrangeButton(
                        label: 'Update Password',
                        onTap: _submit,
                        showArrow: true,
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
