import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/features/auth/presentation/bloc/auth_bloc.dart';
import 'package:mobile/features/auth/presentation/bloc/auth_state.dart';

class UserProfileBar extends StatelessWidget {
  const UserProfileBar({super.key});

  String _getGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'GOOD MORNING';
    if (hour < 17) return 'GOOD AFTERNOON';
    return 'GOOD EVENING';
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<AuthBloc, AuthState>(
      builder: (context, state) {
        String userName = '';
        String? avatarUrl;

        if (state is Authenticated) {
          userName = state.user.fullName;
          avatarUrl = state.user.profilePictureUrl;
        }

        final greeting = _getGreeting();

        return Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
          child: Row(
            children: [
              // USER PROFILE PICTURE
              GestureDetector(
                onTap: () {
                  context.push('/profile');
                },
                child: CircleAvatar(
                  radius: 24,
                  backgroundImage: (avatarUrl != null && avatarUrl.isNotEmpty)
                      ? NetworkImage(avatarUrl) as ImageProvider
                      : const AssetImage('assets/images/user1.png'),
                ),
              ),
              const SizedBox(width: 12),

              // USER INFO (greeting + name)
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      greeting,
                      style: const TextStyle(
                        fontSize: 14,
                        color: Colors.grey,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      userName.isNotEmpty ? userName : 'Traveler',
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),

              // NOTIFICATION ICON
              Container(
                width: 46,
                height: 46,
                decoration: const BoxDecoration(
                  color: Color.fromARGB(255, 245, 241, 241),
                  borderRadius: BorderRadius.all(Radius.circular(23)),
                  boxShadow: [
                    BoxShadow(
                      color: Color.fromARGB(255, 214, 211, 211),
                      blurRadius: 2,
                      offset: Offset(0.5, 0.5),
                    ),
                  ],
                ),
                child: const Icon(
                  Icons.notifications_none_outlined,
                  size: 28,
                  color: Colors.black54,
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}