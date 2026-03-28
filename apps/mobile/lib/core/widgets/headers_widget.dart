import 'package:flutter/material.dart';
import 'package:mobile/core/widgets/logo_header.dart';
import 'package:mobile/core/widgets/user_profile_bar.dart';

class Header extends StatelessWidget {
  const Header({super.key});

  String _getGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }

  @override
  Widget build(BuildContext context) {
    return const Padding(
        padding: EdgeInsets.zero,
        child: Column(
          children: [
            // LOGO OF THE APP
            LogoHeader(),

            SizedBox(
              height: 2,
            ),

            // USER PROFILE HEADER
            UserProfileBar(),

            SizedBox(
              height: 14,
            ),
          ],
        ));
  }
}
