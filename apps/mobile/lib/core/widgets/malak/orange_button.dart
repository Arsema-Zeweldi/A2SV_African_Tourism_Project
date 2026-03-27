import 'package:flutter/material.dart';

class OrangeButton extends StatelessWidget {
  final String label;
  final VoidCallback? onTap;
  final bool showArrow;

  const OrangeButton({
    super.key,
    required this.label,
    this.onTap,
    this.showArrow = true,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: double.infinity,
        height: 52,
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            colors: [Color(0xFFE8781A), Color(0xFFD4621A)],
          ),
          borderRadius: BorderRadius.circular(14),
          boxShadow: [
            BoxShadow(
              color: const Color(0xFFE8781A).withOpacity(0.4),
              blurRadius: 16,
              offset: const Offset(0, 6),
            ),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              label,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 15,
                fontWeight: FontWeight.w700,
                letterSpacing: 0.3,
              ),
            ),
            if (showArrow) ...[
              const SizedBox(width: 8),
              const Icon(Icons.arrow_forward, color: Colors.white, size: 18),
            ],
          ],
        ),
      ),
    );
  }
}
