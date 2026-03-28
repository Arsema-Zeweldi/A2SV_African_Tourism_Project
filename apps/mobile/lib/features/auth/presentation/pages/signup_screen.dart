import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/core/widgets/malak/app_bar.dart';
import 'package:mobile/core/widgets/malak/auth_text_field.dart';
import 'package:mobile/core/widgets/malak/glass_card.dart';
import 'package:mobile/core/widgets/malak/google_button.dart';
import 'package:mobile/core/widgets/malak/or_driver.dart';
import 'package:mobile/core/widgets/malak/orange_button.dart';
import 'package:mobile/core/widgets/malak/savennabg.dart';
import 'package:mobile/features/auth/presentation/bloc/auth_bloc.dart';
import 'package:mobile/features/auth/presentation/bloc/auth_event.dart';
import 'package:mobile/features/auth/presentation/bloc/auth_state.dart';
import 'login_screen.dart';

class SignUpScreen extends StatefulWidget {
  const SignUpScreen({super.key});

  @override
  State<SignUpScreen> createState() => _SignUpScreenState();
}

class _SignUpScreenState extends State<SignUpScreen> {
  final _fullNameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  void dispose() {
    _fullNameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _onSignUp() {
    final fullName = _fullNameController.text.trim();
    final email = _emailController.text.trim();
    final password = _passwordController.text.trim();

    if (fullName.isEmpty || email.isEmpty || password.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please fill in all fields')),
      );
      return;
    }

    context.read<AuthBloc>().add(
          SignUpRequested(
            fullName: fullName,
            email: email,
            password: password,
          ),
        );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SavannaBg(
        child: SafeArea(
          child: SingleChildScrollView(
            child: BlocListener<AuthBloc, AuthState>(
              listener: (context, state) {
                if (state is RegistrationSuccess) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Check your email to verify your account.'),
                      backgroundColor: Colors.green,
                    ),
                  );
                  context.go('/login');
                } else if (state is AuthError) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(state.message),
                      backgroundColor: Colors.red,
                    ),
                  );
                }
              },
              child: BlocBuilder<AuthBloc, AuthState>(
                builder: (context, state) {
                  final isLoading = state is AuthLoading;

                  return Column(
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
                            AuthTextField(
                              label: 'FULL NAME',
                              hint: 'Kofi Mensah',
                              prefixIcon: Icons.person_outline,
                              controller: _fullNameController,
                            ),
                            const SizedBox(height: 16),
                            AuthTextField(
                              label: 'EMAIL ADDRESS',
                              hint: 'kofi@safari.com',
                              prefixIcon: Icons.mail_outline,
                              controller: _emailController,
                            ),
                            const SizedBox(height: 16),
                            AuthTextField(
                              label: 'PASSWORD',
                              hint: '••••••••',
                              prefixIcon: Icons.lock_outline,
                              isPassword: true,
                              controller: _passwordController,
                            ),
                            const SizedBox(height: 22),
                            OrangeButton(
                              label: 'Create Account',
                              onTap: isLoading ? null : _onSignUp,
                              showArrow: true,
                              isLoading: isLoading,
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
                                    color: Color(0xFF6B5B3E),
                                    fontSize: 13,
                                  ),
                                ),
                                GestureDetector(
                                  onTap: () => Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (_) => const LoginScreen(),
                                    ),
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
                  );
                },
              ),
            ),
          ),
        ),
      ),
    );
  }
}