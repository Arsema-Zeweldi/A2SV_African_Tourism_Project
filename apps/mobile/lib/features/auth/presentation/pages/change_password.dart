import 'package:mobile/core/widgets/malak/app_bar.dart';
import 'package:mobile/core/widgets/malak/auth_text_field.dart';
import 'package:mobile/core/widgets/malak/glass_card.dart';
import 'package:mobile/core/widgets/malak/orange_button.dart';
import 'package:mobile/core/widgets/malak/savennabg.dart';
import 'package:flutter/material.dart';

import 'auth_code.dart';

class ChangePasswordScreen extends StatelessWidget {
  const ChangePasswordScreen({super.key});

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
                        'Change',
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
                        'Add your email to receive an email\nfor changing your password.',
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
                      const AuthTextField(
                        label: 'EMAIL ADDRESS',
                        hint: 'your@email.com',
                        prefixIcon: Icons.mail_outline,
                      ),
                      const SizedBox(height: 24),
                      OrangeButton(
                        label: 'Send Reset Link',
                        onTap: () =>
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: (_) => const AuthCodeScreen()),
                            ),
                        showArrow: true,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
