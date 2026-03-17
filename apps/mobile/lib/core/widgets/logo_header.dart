import 'package:flutter/material.dart';

class LogoHeader extends StatelessWidget {
  const LogoHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Image(
        image: AssetImage('assets/images/logo&name.png'),
        height: 35,
        fit: BoxFit.cover,
      ),
    );
  }
}
