import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile/features/feed/domain/entities/post_entity.dart';
import 'package:mobile/features/feed/presentation/bloc/feed_bloc.dart';
import 'package:mobile/features/feed/presentation/bloc/feed_state.dart';

class CommunityCard extends StatelessWidget {
  const CommunityCard({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<FeedBloc, FeedState>(
      builder: (context, state) {
        if (state is FeedLoading) {
          return const Center(child: CircularProgressIndicator());
        }
        if (state is FeedLoaded) {
          final List<Post> posts = state.posts; 
          if (posts.isEmpty) return const SizedBox.shrink();

          final mostLiked = posts.fold<Post?>(null, (Post? best, Post current) {
            if (best == null) return current;
            return current.likesCount > best.likesCount ? current : best;
          });

          if (mostLiked == null) return const SizedBox.shrink();

          return Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color.fromARGB(255, 236, 235, 235),
              borderRadius: BorderRadius.circular(60),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.05),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 35,
                  backgroundImage: mostLiked.mediaUrl.isNotEmpty
                      ? NetworkImage(mostLiked.mediaUrl) as ImageProvider
                      : const AssetImage("assets/images/post1.png"),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          CircleAvatar(
                            radius: 14,
                            backgroundImage: mostLiked.userAvatar.isNotEmpty
                                ? NetworkImage(mostLiked.userAvatar) as ImageProvider
                                : const AssetImage("assets/images/user1.png"),
                          ),
                          const SizedBox(width: 6),
                          Text(
                            mostLiked.userName,
                            style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        mostLiked.content.length > 50
                            ? '${mostLiked.content.substring(0, 50)}...'
                            : mostLiked.content,
                        style: TextStyle(color: Colors.grey[600], fontSize: 13),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
                Column(
                  children: [
                    const Icon(Icons.favorite, color: Color(0xFFE57373), size: 20),
                    Text(
                      mostLiked.likesCount.toString(),
                      style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
                const SizedBox(width: 10),
              ],
            ),
          );
        }
        return const SizedBox.shrink();
      },
    );
  }
}