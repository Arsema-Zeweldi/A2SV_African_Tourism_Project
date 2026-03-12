import 'package:flutter/material.dart';

class PostActionButton extends StatelessWidget {
  final VoidCallback onTap;
  const PostActionButton({super.key, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 65,
        width: 65,
        decoration: BoxDecoration(
          color: const Color(0xFFF39233),
          shape: BoxShape.circle,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.2),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: const Icon(
          Icons.add_a_photo_outlined,
          color: Colors.white,
          size: 30,
        ),
      ),
    );
  }
}
