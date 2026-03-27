import 'package:flutter/material.dart';

class NavItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool active;
  const NavItem(
      {super.key, required this.icon, required this.label, required this.active});

  @override
  Widget build(BuildContext context) {
    final color = active ? const Color(0xFFE8781A) : const Color(0xFFB0A090);
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, color: color, size: 22),
        const SizedBox(height: 2),
        Text(label,
            style: TextStyle(
                fontSize: 9,
                color: color,
                fontWeight: active ? FontWeight.w700 : FontWeight.w400)),
      ],
    );
  }
}
