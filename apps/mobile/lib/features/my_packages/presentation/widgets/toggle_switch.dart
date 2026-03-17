import 'package:flutter/material.dart';
import 'package:mobile/features/my_packages/presentation/widgets/toggle_button.dart';

class ToggleSwitch extends StatelessWidget {
  final bool isCurrentSelected;
  final Function(bool) onToggle; 

  const ToggleSwitch(
      {super.key, required this.isCurrentSelected, required this.onToggle});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: const Color(0xFFF1F3F5),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          ToggleButton(
            title: "Current",
            isActive: isCurrentSelected,
            onTap: () => onToggle(true),
          ),
          ToggleButton(
            title: "Saved",
            isActive: !isCurrentSelected,
            onTap: () => onToggle(false),
          ),
        ],
      ),
    );
  }
}
