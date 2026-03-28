import 'package:flutter/material.dart';

class FeedPostItem extends StatelessWidget {
  final String userName,
      location,
      likes,
      comments,
      description;
  final String? userImage;
  final String? userImageUrl;
  final String? postImage;
  final String? postImageUrl;
  final String? timeAgo;
  final String? postId;
  final VoidCallback? onLike;

  const FeedPostItem(
      {super.key,
      required this.userName,
      required this.location,
      this.userImage,
      this.userImageUrl,
      this.postImage,
      this.postImageUrl,
      required this.likes,
      required this.comments,
      required this.description,
      this.timeAgo,
      this.postId,
      this.onLike});

  @override
  Widget build(BuildContext context) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      ListTile(
        leading: CircleAvatar(
          backgroundImage: _buildAvatarImage(),
        ),
        title:
            Text(userName, style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Row(
          children: [
            const Icon(Icons.location_on_outlined, color: Colors.orange, size: 14),
            const SizedBox(width: 4),
            Text(location,
                style: const TextStyle(color: Colors.orange, fontSize: 12)),
          ],
        ),
        trailing: const Icon(Icons.more_horiz),
      ),
      _buildPostImage(),
      Padding(
        padding: const EdgeInsets.all(12.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    GestureDetector(
                      onTap: onLike,
                      child: const Icon(
                        Icons.favorite,
                        color: Colors.red,
                      ),
                    ),
                    const SizedBox(width: 5),
                    Text(likes,
                        style: const TextStyle(fontWeight: FontWeight.bold)),
                    const SizedBox(width: 15),
                    Icon(
                      Icons.chat_bubble_outline,
                      color: Colors.grey[600],
                    ),
                    const SizedBox(width: 5),
                    Text(comments,
                        style: const TextStyle(fontWeight: FontWeight.bold)),
                    const SizedBox(width: 15),
                    Icon(
                      Icons.share,
                      color: Colors.grey[600],
                    ),
                    const SizedBox(width: 5),
                  ],
                ),
                const Icon(
                  Icons.bookmark_outline,
                ),
              ],
            ),
            const SizedBox(height: 8),
            RichText(
              text: TextSpan(
                style: const TextStyle(color: Colors.black, fontSize: 14),
                children: [
                  TextSpan(
                      text: "$userName ",
                      style: const TextStyle(fontWeight: FontWeight.bold)),
                  TextSpan(text: description),
                ],
              ),
            ),
            const SizedBox(height: 8),
            Text(
              timeAgo ?? "JUST NOW",
              style: const TextStyle(color: Colors.grey, fontSize: 10),
            ),
          ],
        ),
      )
    ]);
  }

  ImageProvider _buildAvatarImage() {
    if (userImageUrl != null && userImageUrl!.isNotEmpty) {
      return NetworkImage(userImageUrl!);
    }
    return AssetImage(userImage ?? 'assets/images/user1.png');
  }

  Widget _buildPostImage() {
    if (postImageUrl != null && postImageUrl!.isNotEmpty) {
      return Image.network(
        postImageUrl!,
        width: double.infinity,
        fit: BoxFit.cover,
        errorBuilder: (_, __, ___) => const SizedBox(height: 200, child: Center(child: Icon(Icons.broken_image, color: Colors.grey))),
      );
    }
    if (postImage != null && postImage!.isNotEmpty) {
      return Image.asset(postImage!, width: double.infinity, fit: BoxFit.cover);
    }
    return const SizedBox.shrink();
  }
}
