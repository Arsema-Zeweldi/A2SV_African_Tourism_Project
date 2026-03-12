import 'package:flutter/material.dart';
import 'package:mobile/core/constants/app_colors.dart';
import 'package:mobile/core/widgets/category_toggle.dart';
import 'package:mobile/core/widgets/plan_trip_button.dart';
import 'package:mobile/features/feed/presentation/widgets/feed_post_item.dart';
import 'package:mobile/core/widgets/headers_widget.dart';
import 'package:mobile/features/feed/presentation/widgets/post_action_button.dart';

class FeedPage extends StatelessWidget {
  final VoidCallback onPackagesTap;
  const FeedPage({super.key, required this.onPackagesTap});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.scaffoldBackground,
      floatingActionButton: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          PostActionButton(
            onTap: () {},
          ),
          const SizedBox(
            height: 16,
          ),
          PlanTripButton(
            onPressed: () {},
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
            padding: const EdgeInsets.all(14.0),
            child: Column(
              children: [
                const Header(),
                
                CategoryToggle(
                  isFeedActive: true,
                  onFeedTap: () {},
                  onPackagesTap: onPackagesTap,
                ),

                const SizedBox(height: 10),

                // FEED POSTS
                const FeedPostItem(
                  userName: "John Doe",
                  location: "Nairobi, Kenya",
                  userImage: "assets/images/user1.png",
                  postImage: "assets/images/post1.png",
                  likes: "120",
                  comments: "45",
                  description:
                      "Had an amazing time exploring Nairobi! #travel #adventure",
                )
              ],
            )),
      ),
    );
  }
}
