import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/core/widgets/malak/savennabg.dart';
import 'package:mobile/features/auth/presentation/bloc/auth_bloc.dart';
import 'package:mobile/features/auth/presentation/bloc/auth_event.dart';
import 'package:mobile/features/auth/presentation/bloc/auth_state.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscure = true;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _onLogin() {
    final email = _emailController.text.trim();
    final password = _passwordController.text;
    if (email.isEmpty || password.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please enter email and password'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }
    context.read<AuthBloc>().add(LoginRequested(email: email, password: password));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: true,
      body: BlocListener<AuthBloc, AuthState>(
        listener: (context, state) {
          if (state is Authenticated) {
            context.go('/app');
          } else if (state is AuthError) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text(state.message), backgroundColor: Colors.red),
            );
          }
        },
        child: SavannaBg(
          child: SafeArea(
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // ── App bar ──
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                    child: Row(
                      children: [
                        GestureDetector(
                          onTap: () => context.go('/onboarding'),
                          child: Container(
                            width: 36,
                            height: 36,
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.25),
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(Icons.arrow_back_ios_new,
                                color: Colors.white, size: 16),
                          ),
                        ),
                        const Spacer(),
                        Row(
                          children: [
                            Container(
                              width: 28, height: 28,
                              decoration: const BoxDecoration(
                                color: Color(0xFFE8781A), shape: BoxShape.circle,
                              ),
                              child: const Center(child: Text('🌍', style: TextStyle(fontSize: 14))),
                            ),
                            const SizedBox(width: 6),
                            const Text('Amoni',
                                style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w600)),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                  // ── Header ──
                  const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Text('Welcome ',
                                style: TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.w800)),
                            Text('Back',
                                style: TextStyle(
                                    color: Color(0xFFE8781A),
                                    fontSize: 28,
                                    fontWeight: FontWeight.w800,
                                    fontStyle: FontStyle.italic)),
                          ],
                        ),
                        SizedBox(height: 4),
                        Text('Log in to continue your journey across the continent.',
                            style: TextStyle(color: Colors.white70, fontSize: 12, height: 1.4)),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                  // ── Form card ──
                  Container(
                    margin: const EdgeInsets.symmetric(horizontal: 20),
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.92),
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: [
                        BoxShadow(color: Colors.black.withOpacity(0.15), blurRadius: 30, offset: const Offset(0, 10)),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // ── Email ──
                        const Text('EMAIL ADDRESS',
                            style: TextStyle(
                                fontSize: 10, fontWeight: FontWeight.w700, letterSpacing: 1.2, color: Color(0xFF6B5B3E))),
                        const SizedBox(height: 5),
                        Container(
                          decoration: BoxDecoration(
                            color: const Color(0xFFF5F0E8),
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(color: const Color(0xFFE8D5B0)),
                          ),
                          child: TextField(
                            controller: _emailController,
                            keyboardType: TextInputType.emailAddress,
                            style: const TextStyle(fontSize: 13, color: Color(0xFF3D2B1A)),
                            decoration: InputDecoration(
                              hintText: 'your@email.com',
                              hintStyle: TextStyle(color: const Color(0xFF9E8A70).withOpacity(0.7), fontSize: 13),
                              prefixIcon: const Icon(Icons.mail_outline, color: Color(0xFF9E8A70), size: 16),
                              border: InputBorder.none,
                              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
                            ),
                          ),
                        ),
                        const SizedBox(height: 12),
                        // ── Password label + forgot ──
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text('PASSWORD',
                                style: TextStyle(
                                    fontSize: 10, fontWeight: FontWeight.w700, letterSpacing: 1.2, color: Color(0xFF6B5B3E))),
                            GestureDetector(
                              onTap: () => context.push('/forgot-password'),
                              child: const Text('Forgot?',
                                  style: TextStyle(fontSize: 11, color: Color(0xFFE8781A), fontWeight: FontWeight.w600)),
                            ),
                          ],
                        ),
                        const SizedBox(height: 6),
                        Container(
                          decoration: BoxDecoration(
                            color: const Color(0xFFF5F0E8),
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(color: const Color(0xFFE8D5B0)),
                          ),
                          child: TextField(
                            controller: _passwordController,
                            obscureText: _obscure,
                            style: const TextStyle(fontSize: 13, color: Color(0xFF3D2B1A)),
                            onSubmitted: (_) => _onLogin(),
                            decoration: InputDecoration(
                              hintText: '••••••••',
                              hintStyle: TextStyle(color: const Color(0xFF9E8A70).withOpacity(0.7), fontSize: 13),
                              prefixIcon: const Icon(Icons.lock_outline, color: Color(0xFF9E8A70), size: 16),
                              suffixIcon: GestureDetector(
                                onTap: () => setState(() => _obscure = !_obscure),
                                child: Icon(
                                  _obscure ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                                  color: const Color(0xFF9E8A70), size: 16,
                                ),
                              ),
                              border: InputBorder.none,
                              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),
                        // ── Login button ──
                        BlocBuilder<AuthBloc, AuthState>(
                          builder: (context, state) {
                            final isLoading = state is AuthLoading;
                            return GestureDetector(
                              onTap: isLoading ? null : _onLogin,
                              child: Container(
                                width: double.infinity,
                                height: 46,
                                decoration: BoxDecoration(
                                  gradient: const LinearGradient(colors: [Color(0xFFE8781A), Color(0xFFD4621A)]),
                                  borderRadius: BorderRadius.circular(12),
                                  boxShadow: [
                                    BoxShadow(
                                        color: const Color(0xFFE8781A).withOpacity(0.35),
                                        blurRadius: 12,
                                        offset: const Offset(0, 5)),
                                  ],
                                ),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: isLoading
                                      ? [
                                          const SizedBox(
                                              width: 20, height: 20,
                                              child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2)),
                                          const SizedBox(width: 10),
                                          const Text('Logging in...',
                                              style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w700)),
                                        ]
                                      : [
                                          const Text('Login',
                                              style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w700)),
                                          const SizedBox(width: 6),
                                          const Icon(Icons.arrow_forward, color: Colors.white, size: 16),
                                        ],
                                ),
                              ),
                            );
                          },
                        ),
                        // ── Divider ──
                        Padding(
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          child: Row(
                            children: [
                              Expanded(child: Divider(color: const Color(0xFFD4C4A8).withOpacity(0.6))),
                              const Padding(
                                padding: EdgeInsets.symmetric(horizontal: 10),
                                child: Text('Or join with', style: TextStyle(fontSize: 11, color: Color(0xFF9E8A70))),
                              ),
                              Expanded(child: Divider(color: const Color(0xFFD4C4A8).withOpacity(0.6))),
                            ],
                          ),
                        ),
                        // ── Google button ──
                        Container(
                          width: double.infinity,
                          height: 44,
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: const Color(0xFFE0D5C5), width: 1.5),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Container(
                                width: 18, height: 18,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  border: Border.all(color: const Color(0xFF4285F4).withOpacity(0.3)),
                                ),
                                child: const Center(
                                    child: Text('G',
                                        style: TextStyle(
                                            color: Color(0xFF4285F4), fontSize: 11, fontWeight: FontWeight.w700))),
                              ),
                              const SizedBox(width: 8),
                              const Text('Sign in with Google',
                                  style: TextStyle(color: Color(0xFF4A3728), fontSize: 13, fontWeight: FontWeight.w600)),
                            ],
                          ),
                        ),
                        const SizedBox(height: 12),
                        // ── Sign up link ──
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Text('New to the tribe? ',
                                style: TextStyle(color: Color(0xFF6B5B3E), fontSize: 12)),
                            GestureDetector(
                              onTap: () => context.go('/signup'),
                              child: const Text('Sign Up',
                                  style: TextStyle(
                                      color: Color(0xFFE8781A), fontSize: 12, fontWeight: FontWeight.w700)),
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
                      'By continuing, you agree to our Terms of Service and Privacy Policy.',
                      style: TextStyle(color: Colors.white38, fontSize: 10, height: 1.4),
                      textAlign: TextAlign.center,
                    ),
                  ),
                  const SizedBox(height: 24),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
