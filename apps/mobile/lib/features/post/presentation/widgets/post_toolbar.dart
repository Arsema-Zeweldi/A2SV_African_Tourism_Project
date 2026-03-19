import 'package:flutter/material.dart';

class PostToolbar extends StatelessWidget {
  final int currentLength;
  final VoidCallback? onPhotoTap;

  const PostToolbar({
    super.key,
    required this.currentLength,
    this.onPhotoTap,
  });

  @override
  Widget build(BuildContext context) {
    final bottomPadding = MediaQuery.of(context).viewInsets.bottom;

    return Container(
      padding: EdgeInsets.only(
        left: 16,
        right: 16,
        top: 12,
        bottom: bottomPadding > 0 ? 12 : 30,
      ),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: Colors.grey.shade100)),
      ),
      child: Row(
        children: [
          _buildIconButton(Icons.camera_alt_outlined, onPhotoTap),
          const SizedBox(width: 24),
          _buildIconButton(Icons.alternate_email, () {}),
          const SizedBox(width: 24),
          _buildIconButton(Icons.tag, () {}),
          const SizedBox(width: 24),
          _buildIconButton(Icons.sentiment_satisfied_alt_outlined, () {}),
          const Spacer(),
          Text(
            "$currentLength / 2200",
            style: const TextStyle(
              color: Color(0xFFADB5BD),
              fontSize: 14,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildIconButton(IconData icon, VoidCallback? onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Icon(icon, color: const Color(0xFF909AAB), size: 24),
    );
  }
}
