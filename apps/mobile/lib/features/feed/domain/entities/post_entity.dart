import 'package:equatable/equatable.dart';

class Post extends Equatable {
  final String id;
  final String userId;
  final String userName;
  final String userAvatar;
  final String content;
  final String mediaUrl;
  final String mediaType;
  final String location;
  final String packageName;
  final int likesCount;
  final int commentsCount;
  final List<String> tags;
  final DateTime createdAt;
  final String status;

  const Post({
    required this.id,
    required this.userId,
    required this.userName,
    required this.userAvatar,
    required this.content,
    required this.mediaUrl,
    required this.mediaType,
    required this.location,
    required this.packageName,
    required this.likesCount,
    required this.commentsCount,
    required this.tags,
    required this.createdAt,
    required this.status,
  });

  @override
  List<Object?> get props => [id];
}

class PostComment extends Equatable {
  final String id;
  final String postId;
  final String userId;
  final String userName;
  final String userAvatar;
  final String text;
  final DateTime createdAt;

  const PostComment({
    required this.id,
    required this.postId,
    required this.userId,
    required this.userName,
    required this.userAvatar,
    required this.text,
    required this.createdAt,
  });

  @override
  List<Object?> get props => [id];
}

class PaginatedPosts {
  final List<Post> posts;
  final int total;
  final int page;
  final int pageSize;

  const PaginatedPosts({
    required this.posts,
    required this.total,
    required this.page,
    required this.pageSize,
  });
}
