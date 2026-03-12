import 'package:flutter/material.dart';
import '../../../../core/constants/colors.dart';

class CustomIndicator extends StatelessWidget {
  final int count;
  final int currentIndex;
  final Color? activeColor;
  final Color? inactiveColor;
  final MainAxisAlignment alignment;

  const CustomIndicator({
    super.key,
    required this.count,
    required this.currentIndex,
    this.alignment = MainAxisAlignment.center,
    this.activeColor,
    this.inactiveColor,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: alignment,
      children: List.generate(count, (index) {
        bool isActive = index == currentIndex;
        return AnimatedContainer(
          duration: const Duration(milliseconds: 300),
          margin: const EdgeInsets.only(right: 6),
          height: 3,
          width: isActive ? 28 : 20,
          decoration: BoxDecoration(
            color: isActive
                ? (activeColor ?? AppColors.primary)
                : (inactiveColor ?? Colors.white.withOpacity(0.5)),
            borderRadius: BorderRadius.circular(2),
          ),
        );
      }),
    );
  }
}
