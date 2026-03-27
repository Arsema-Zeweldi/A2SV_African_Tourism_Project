import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/core/constants/app_colors.dart';
import 'package:mobile/core/widgets/category_toggle.dart';
import 'package:mobile/core/widgets/headers_widget.dart';
import 'package:mobile/core/widgets/plan_trip_button.dart';
import 'package:mobile/features/home/presentation/widgets/community_card.dart';
import 'package:mobile/features/home/presentation/widgets/package_card.dart';
import 'package:mobile/features/market_place/presentation/pages/package_detail_page.dart';

class HomePage extends StatefulWidget {
  final VoidCallback onFeedClick;

  const HomePage({super.key, required this.onFeedClick});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  bool showPackages = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color.fromRGBO(248, 247, 245, 1.0),
      floatingActionButton: PlanTripButton(onPressed: () {
        context.push('/plan-trip');
      }),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(14.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Header(),
              
              CategoryToggle(onFeedTap: widget.onFeedClick),
              const SizedBox(height: 24),
              
              if (showPackages) ...[
                const Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text("Top-Rated Packages",
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                    Text("See All",
                        style: TextStyle(color: AppColors.primaryOrange)),
                  ],
                ),
                const SizedBox(height: 16),

                // PACKAGES LIST
                Column(
                  children: List.generate(3, (index) => GestureDetector(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => PackageDetailPage(
                            title: "Discover the Wonders of Egypt",
                            location: "Cairo, Egypt",
                            price: "1,200",
                            rating: "4.5",
                            reviewsCount: "89",
                            duration: "7 Days",
                            groupType: "All Ages",
                            category: "Cultural",
                            description: "Experience the magic of ancient Egypt — from the pyramids of Giza to the temples of Luxor.",
                            imagePath: "assets/images/top_rated${index + 1}.png",
                          ),
                        ),
                      );
                    },
                    child: PackageCard(
                      imagePath: "assets/images/top_rated${index + 1}.png",
                      rating: 4.5,
                      title: "Discover the Wonders of Egypt",
                      price: '1200',
                      location: "Cairo, Egypt",
                      categoryName: "Cultural",
                      categoryColor: Colors.orange,
                      duration: "7 Days",
                      targetAudience: "All Ages",
                      isBestSeller: index == 0,
                    ),
                  )),
                ),

                const SizedBox(height: 24),
                const CommunityCard(),
                const SizedBox(height: 100),
              ]
            ],
          ),
        ),
      ),      
    );
  }
}
