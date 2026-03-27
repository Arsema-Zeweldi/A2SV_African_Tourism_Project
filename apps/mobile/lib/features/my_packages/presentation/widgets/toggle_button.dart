import 'package:flutter/material.dart';

class ToggleButton extends StatelessWidget {
  final String title;
  final bool isActive;
  final VoidCallback onTap;
  const ToggleButton({super.key, required this.title, required this.isActive, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: isActive ? Colors.orange : Colors.transparent,
            borderRadius: BorderRadius.circular(10),
            boxShadow: isActive ? [BoxShadow(color: Colors.orange.withValues(alpha: 0.3), blurRadius: 8)] : [],
          ),
          child: Center(
            child: Text(
              title,
              style: TextStyle(
                color: isActive ? Colors.white : Colors.black,
                fontWeight: FontWeight.bold,
              ),
            )
          ),
        )
      )
    );
  }
}