import 'dart:convert';
import 'package:mobile/features/feed/domain/entities/post_entity.dart';

class PostModel extends Post {
  const PostModel({
    required super.id,
    required super.userId,
    required super.userName,
    required super.userAvatar,
    required super.content,
    required super.mediaUrl,
    required super.mediaType,
    required super.location,
    required super.packageName,
    required super.likesCount,
    required super.commentsCount,
    required super.tags,
    required super.createdAt,
    required super.status,
  });

  factory PostModel.fromJson(Map<String, dynamic> json) {
    List<String> parsedTags = [];
    if (json['tags'] != null) {
      if (json['tags'] is List) {
        parsedTags = (json['tags'] as List).map((t) => t.toString()).toList();
      } else if (json['tags'] is String) {
        try {
          final decoded = jsonDecode(json['tags']);
          if (decoded is List) {
            parsedTags = decoded.map((t) => t.toString()).toList();
          }
        } catch (_) {}
      }
    }

    return PostModel(
      id: json['post_id']?.toString() ?? '',
      userId: json['user_id']?.toString() ?? '',
      userName: json['user_name'] ?? '',
      userAvatar: json['user_avatar'] ?? '',
      content: json['content'] ?? '',
      mediaUrl: json['media_url'] ?? '',
      mediaType: json['media_type'] ?? '',
      location: json['location'] ?? '',
      packageName: json['package_name'] ?? '',
      likesCount: json['likes_count'] ?? 0,
      commentsCount: json['comments_count'] ?? 0,
      tags: parsedTags,
      createdAt: _parseDate(json['created_at']),
      status: json['status'] ?? 'public',
    );
  }

  static DateTime _parseDate(dynamic value) {
    if (value == null) return DateTime.now();
    if (value is String) return DateTime.tryParse(value) ?? DateTime.now();
    return DateTime.now();
  }
}

class PostCommentModel extends PostComment {
  const PostCommentModel({
    required super.id,
    required super.postId,
    required super.userId,
    required super.userName,
    required super.userAvatar,
    required super.text,
    required super.createdAt,
  });

  factory PostCommentModel.fromJson(Map<String, dynamic> json) {
    return PostCommentModel(
      id: json['comment_id']?.toString() ?? '',
      postId: json['post_id']?.toString() ?? '',
      userId: json['user_id']?.toString() ?? '',
      userName: json['user_name'] ?? '',
      userAvatar: json['user_avatar'] ?? '',
      text: json['text'] ?? '',
      createdAt: _parseDate(json['created_at']),
    );
  }

  static DateTime _parseDate(dynamic value) {
    if (value == null) return DateTime.now();
    if (value is String) return DateTime.tryParse(value) ?? DateTime.now();
    return DateTime.now();
  }
}
