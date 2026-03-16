import 'package:flutter/material.dart';
import 'package:mobile/core/constants/app_colors.dart';
import 'package:mobile/features/marketPlace/presentation/widgets/category_filter.dart';
import 'package:mobile/features/marketPlace/presentation/widgets/market_package_card.dart';
import 'package:mobile/features/marketPlace/presentation/widgets/market_place_header.dart';

class MarketPage extends StatelessWidget {
  const MarketPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.scaffoldBackground,
      floatingActionButton: Container(
        height: 60,
        width: 60,
        decoration: BoxDecoration(
          color: const Color(0xFFF39233),
          shape: BoxShape.circle,
          boxShadow: [
            BoxShadow(
                color: Colors.orange.withValues(alpha: 0.3),
                blurRadius: 10,
                offset: const Offset(0, 5))
          ],
        ),
        child: const Icon(Icons.chat_bubble_outline, color: Colors.white),
      ),
      body: SafeArea(
          child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: SingleChildScrollView(
          child: Column(
            children: [
              const MarketPlaceHeader(),
              const SizedBox(height: 16),
              CategoryFilter(),
              const SizedBox(
                height: 20,
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    "Curated Packages",
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  TextButton(
                    onPressed: () {},
                    child: const Text("See all",
                        style: TextStyle(color: Colors.orange)),
                  ),
                ],
              ),

              // PACKAGE CARDS
              GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  crossAxisSpacing: 16,
                  mainAxisSpacing: 16,
                  childAspectRatio: 0.65,
                ),
                itemCount: 6,
                itemBuilder: (context, index) {
                  return const MarketPackageCard(
                    title: "Serengeti Great Migration Safari",
                    price: '2,450',
                    image: 'assets/images/top_rated1.png',
                    label: 'TOP RATED',
                    rating: '4.9',
                    duration: '7 Days',
                  );
                },
              ),
              const SizedBox(height: 80),
            ],
          ),
        ),
      )),
    );
  }
}
