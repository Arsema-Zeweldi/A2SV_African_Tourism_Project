import 'package:flutter/material.dart';

class PostDescriptionField extends StatelessWidget {
  final TextEditingController controller;
  final Function(String) onChanged;

  const PostDescriptionField({
    super.key,
    required this.controller,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: controller,
      onChanged: onChanged,
      maxLines: null,
      keyboardType: TextInputType.multiline,
      style: const TextStyle(fontSize: 16, height: 1.5),
      decoration: const InputDecoration(
        hintText: "Share your safari story...",
        hintStyle: TextStyle(
          color: Color(0xFFADB5BD),
          fontSize: 18,
        ),
        border: InputBorder.none,
        isDense: true,
        contentPadding: EdgeInsets.symmetric(vertical: 12),
      ),
    );
  }
}
