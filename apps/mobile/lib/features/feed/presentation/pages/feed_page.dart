import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/core/constants/app_colors.dart';
import 'package:mobile/core/widgets/category_toggle.dart';
import 'package:mobile/core/widgets/plan_trip_button.dart';
import 'package:mobile/features/feed/presentation/widgets/feed_post_item.dart';
import 'package:mobile/core/widgets/headers_widget.dart';
import 'package:mobile/features/feed/presentation/widgets/post_action_button.dart';
import 'package:mobile/features/feed/presentation/bloc/feed_bloc.dart';
import 'package:mobile/features/feed/presentation/bloc/feed_event.dart';
import 'package:mobile/features/feed/presentation/bloc/feed_state.dart';

class FeedPage extends StatelessWidget {
  final VoidCallback onPackagesTap;
  const FeedPage({super.key, required this.onPackagesTap});

  String _timeAgo(DateTime date) {
    final diff = DateTime.now().difference(date);
    if (diff.inDays > 0) return '${diff.inDays}D AGO';
    if (diff.inHours > 0) return '${diff.inHours}H AGO';
    if (diff.inMinutes > 0) return '${diff.inMinutes}M AGO';
    return 'JUST NOW';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.scaffoldBackground,
      floatingActionButton: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          PostActionButton(
            onTap: () {
              context.push('/new-post');
            },
          ),
          const SizedBox(height: 16),
          PlanTripButton(
            onPressed: () {
              context.push('/plan-trip');
            },
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

                // FEED POSTS — driven by FeedBloc
                BlocBuilder<FeedBloc, FeedState>(
                  builder: (context, state) {
                    if (state is FeedLoading) {
                      return const Padding(
                        padding: EdgeInsets.all(32),
                        child: Center(child: CircularProgressIndicator(color: AppColors.primaryOrange)),
                      );
                    }

                    if (state is FeedError) {
                      return Center(
                        child: Column(
                          children: [
                            Text(state.message, style: const TextStyle(color: Colors.red)),
                            TextButton(
                              onPressed: () => context.read<FeedBloc>().add(const LoadPosts()),
                              child: const Text('Retry'),
                            ),
                          ],
                        ),
                      );
                    }

                    if (state is FeedLoaded) {
                      if (state.posts.isEmpty) {
                        return const Padding(
                          padding: EdgeInsets.all(32),
                          child: Center(child: Text('No posts yet. Be the first to share!', style: TextStyle(color: Colors.grey))),
                        );
                      }

                      return Column(
                        children: state.posts.map((post) {
                          return FeedPostItem(
                            postId: post.id,
                            userName: post.userName.isNotEmpty ? post.userName : 'Anonymous',
                            location: post.location,
                            userImageUrl: post.userAvatar,
                            postImageUrl: post.mediaUrl,
                            likes: post.likesCount.toString(),
                            comments: post.commentsCount.toString(),
                            description: post.content,
                            timeAgo: _timeAgo(post.createdAt),
                            onLike: () => context.read<FeedBloc>().add(TogglePostLike(post.id)),
                          );
                        }).toList(),
                      );
                    }

                    return const SizedBox.shrink();
                  },
                ),
              ],
            )),
      ),
    );
  }
}
