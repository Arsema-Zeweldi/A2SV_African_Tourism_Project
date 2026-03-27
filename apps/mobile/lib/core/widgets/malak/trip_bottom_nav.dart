import 'package:flutter/material.dart';

import 'nav_item.dart';

class TripBottomNav extends StatelessWidget {
  const TripBottomNav({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border(
            top: BorderSide(
                color: const Color(0xFFE8D5B0).withOpacity(0.5))),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children:  [
          NavItem(icon: Icons.home_outlined, label: 'Home', active: false),
          NavItem(icon: Icons.explore_outlined, label: 'Explore', active: false),
          NavItem(icon: Icons.luggage_outlined, label: 'My Packages', active: true),
          NavItem(icon: Icons.storefront_outlined, label: 'Market', active: false),
        ],
      ),
    );
  }
}
