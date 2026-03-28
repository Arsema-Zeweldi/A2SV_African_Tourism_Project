import 'package:flutter/material.dart';

class CategoryFilter extends StatefulWidget {
  final Function(String?) onCategorySelected;

  const CategoryFilter({super.key, required this.onCategorySelected});

  @override
  State<CategoryFilter> createState() => _CategoryFilterState();
}

class _CategoryFilterState extends State<CategoryFilter> {
  static const List<String> categories = [
    'All Explorations',
    'Safaris',
    'Beach',
    'Cultural',
  ];

  int _selectedIndex = 0;

  void _onCategoryTap(int index) {
    setState(() {
      _selectedIndex = index;
    });
    final category = categories[index];
    final selectedCategory = category == 'All Explorations' ? null : category;
    widget.onCategorySelected(selectedCategory);
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 40,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: categories.length,
        itemBuilder: (context, index) {
          final isActive = index == _selectedIndex;
          return GestureDetector(
            onTap: () => _onCategoryTap(index),
            child: Container(
              margin: const EdgeInsets.only(right: 8),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                color: isActive ? const Color(0xFFF39233) : Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: Colors.grey.shade300),
              ),
              child: Text(
                categories[index],
                style: TextStyle(
                  color: isActive ? Colors.white : Colors.black54,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}