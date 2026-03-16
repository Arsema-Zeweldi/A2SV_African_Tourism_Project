import 'package:flutter/material.dart';

class FeedPostItem extends StatelessWidget {
  final String userName,
      location,
      userImage,
      postImage,
      likes,
      comments,
      description;
  const FeedPostItem(
      {super.key,
      required this.userName,
      required this.location,
      required this.userImage,
      required this.postImage,
      required this.likes,
      required this.comments,
      required this.description});

  @override
  Widget build(BuildContext context) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      ListTile(
        leading: CircleAvatar(
          backgroundImage: AssetImage(userImage),
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
      Image.asset(
        postImage,
        width: double.infinity,
        fit: BoxFit.cover,
      ),
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
                    const Icon(
                      Icons.favorite,
                      color: Colors.red,
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
            const Text(
              "2 HOURS AGO",
              style: TextStyle(color: Colors.grey, fontSize: 10),
            ),
          ],
        ),
      )
    ]);
  }
}
