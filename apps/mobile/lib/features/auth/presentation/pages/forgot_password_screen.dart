// TODO: Replace this placeholder with the real Forgot Password screen (see Figma: "Change Password").
//
// CONTRACT — Your screen must:
//   1. Keep the class name: ForgotPasswordScreen
//   2. Keep the file at this exact path
//   3. On submit, call:
//        context.read<AuthBloc>().add(PasswordResetRequested(email: ...))
//   4. Listen for PasswordResetSent state → show success, then pop back to login

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/core/constants/app_colors.dart';
import 'package:mobile/features/auth/presentation/bloc/auth_bloc.dart';
import 'package:mobile/features/auth/presentation/bloc/auth_event.dart';
import 'package:mobile/features/auth/presentation/bloc/auth_state.dart';

class ForgotPasswordScreen extends StatefulWidget {
  const ForgotPasswordScreen({super.key});

  @override
  State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  final _emailController = TextEditingController();

  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
  }

  void _onSendResetLink() {
    context.read<AuthBloc>().add(
          PasswordResetRequested(email: _emailController.text.trim()),
        );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.scaffoldBackground,
      body: BlocListener<AuthBloc, AuthState>(
        listener: (context, state) {
          if (state is PasswordResetSent) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Reset link sent! Check your email.'),
                backgroundColor: Colors.green,
              ),
            );
            context.go('/login');
          } else if (state is AuthError) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.message),
                backgroundColor: Colors.red.shade400,
              ),
            );
          }
        },
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(height: 16),
                Align(
                  alignment: Alignment.centerLeft,
                  child: IconButton(
                    icon: const Icon(Icons.arrow_back_ios),
                    onPressed: () => context.pop(),
                  ),
                ),
                const SizedBox(height: 24),
                const Text(
                  'Change',
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: AppColors.primaryDark,
                  ),
                ),
                const Text(
                  'Password',
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: AppColors.primaryOrange,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Add your email to receive an email for changing your password.',
                  style: TextStyle(fontSize: 14, color: Colors.grey.shade600),
                ),
                const SizedBox(height: 32),
                TextField(
                  controller: _emailController,
                  keyboardType: TextInputType.emailAddress,
                  decoration: InputDecoration(
                    labelText: 'EMAIL ADDRESS',
                    hintText: 'your@email.com',
                    prefixIcon: const Icon(Icons.mail_outline),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                BlocBuilder<AuthBloc, AuthState>(
                  builder: (context, state) {
                    final isLoading = state is AuthLoading;
                    return ElevatedButton(
                      onPressed: isLoading ? null : _onSendResetLink,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primaryOrange,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(28),
                        ),
                      ),
                      child: isLoading
                          ? const SizedBox(
                              height: 20,
                              width: 20,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                color: Colors.white,
                              ),
                            )
                          : const Text(
                              'Send Reset Link ➤',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                    );
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
