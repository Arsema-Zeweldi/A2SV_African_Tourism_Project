import 'package:flutter/material.dart';

class MarketPlaceHeader extends StatelessWidget {
  final TextEditingController searchController;
  final VoidCallback onFilterPressed;
  final ValueChanged<String> onSearchSubmitted;

  const MarketPlaceHeader({
    super.key,
    required this.searchController,
    required this.onFilterPressed,
    required this.onSearchSubmitted,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            // IconButton(
            //   icon: const Icon(Icons.arrow_back),
            //   onPressed: () => Navigator.push(context, MaterialPageRoute(builder: MyP)),
            // ),
            const Text(
              "Market Place",
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            IconButton(
              icon: const Icon(Icons.shopping_bag_outlined),
              onPressed: () {},
            ),
          ],
        ),
        const SizedBox(height: 16),
        Row(
          children: [
            Expanded(
              child: TextField(
                controller: searchController,
                decoration: InputDecoration(
                  hintText: "Where to next?",
                  hintStyle: const TextStyle(color: Colors.grey),
                  prefixIcon: const Icon(Icons.search, color: Colors.grey),
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(15),
                    borderSide: BorderSide.none,
                  ),
                ),
                onSubmitted: onSearchSubmitted,
              ),
            ),
            const SizedBox(width: 12),
            GestureDetector(
              onTap: onFilterPressed,
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFFF39233),
                  borderRadius: BorderRadius.circular(15),
                ),
                child: const Icon(Icons.tune, color: Colors.white),
              ),
            ),
          ],
        ),
      ],
    );
  }
}