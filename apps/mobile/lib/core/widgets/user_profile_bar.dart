import 'package:flutter/material.dart';
import 'package:mobile/features/profile/presentation/pages/profile_page.dart';

class UserProfileBar extends StatelessWidget {
  const UserProfileBar({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
      // decoration: BoxDecoration(
      //   color: Colors.grey[50],
      //   borderRadius: BorderRadius.circular(12),
      //   border: Border.all(color: Colors.grey[200]!),
      // ),
      child: Row(
        children: [
          // USER PROFILE PICTURE
          GestureDetector(
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const ProfilePage(),
                ),
              );
            },
            child: const CircleAvatar(
              radius: 24,
              // backgroundImage: AssetImage('assets/images/user_profile.png'),
            ),
          ),
          const SizedBox(width: 12),

          // USER INFO
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'GOOD MORNING',
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey,
                  ),
                ),
                SizedBox(height: 2),
                Text(
                  'Jambo, Alex',
                  style: TextStyle(
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
  }
}
