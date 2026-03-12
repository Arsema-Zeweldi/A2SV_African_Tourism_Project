import 'package:flutter/material.dart';

class CategoryToggle extends StatelessWidget {
  final VoidCallback onFeedTap;
  final VoidCallback? onPackagesTap; 
  final bool isFeedActive; 

  const CategoryToggle({
    super.key,
    required this.onFeedTap,
    this.onPackagesTap,
    this.isFeedActive = false, 
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 60,
      decoration: BoxDecoration(
        color: const Color(0xFFF1F0EE),
        borderRadius: BorderRadius.circular(30),
      ),
      child: Row(
        children: [

          // PACKAGES TOGGLE
          Expanded(
            child: GestureDetector(
              onTap: onPackagesTap,
              child: Container(
                margin: const EdgeInsets.all(4),
                height: 50,
                decoration: BoxDecoration(
                  color: !isFeedActive ? const Color(0xFFF39233) : Colors.transparent,
                  borderRadius: BorderRadius.circular(30),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.explore_outlined, color: !isFeedActive ? Colors.white : Colors.grey[600]),
                    const SizedBox(width: 8),
                    Text("Packages", style: TextStyle(color: !isFeedActive ? Colors.white : Colors.grey[600], fontWeight: FontWeight.bold)),
                  ],
                ),
              ),
            ),
          ),
          
          // FEED TOGGLE
          Expanded(
            child: GestureDetector(
              onTap: onFeedTap,
              child: Container(
                margin: const EdgeInsets.all(4),
                height: 50,
                decoration: BoxDecoration(
                  color: isFeedActive ? const Color(0xFFF39233) : Colors.transparent,
                  borderRadius: BorderRadius.circular(30),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.chat_bubble_outline, color: isFeedActive ? Colors.white : Colors.grey[600]),
                    const SizedBox(width: 8),
                    Text("Feed", style: TextStyle(color: isFeedActive ? Colors.white : Colors.grey[600], fontWeight: FontWeight.bold)),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}