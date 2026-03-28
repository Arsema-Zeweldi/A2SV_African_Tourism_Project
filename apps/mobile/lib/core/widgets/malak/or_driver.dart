import 'package:flutter/material.dart';

class OrDivider extends StatelessWidget {
  const OrDivider({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 14),
      child: Row(
        children: [
          Expanded(
              child: Divider(color: const Color(0xFFD4C4A8).withOpacity(0.6))),
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 12),
            child: Text(
              'Or join with',
              style: TextStyle(
                fontSize: 12,
                color: Color(0xFF9E8A70),
              ),
            ),
          ),
          Expanded(
              child: Divider(color: const Color(0xFFD4C4A8).withOpacity(0.6))),
        ],
      ),
    );
  }
}
