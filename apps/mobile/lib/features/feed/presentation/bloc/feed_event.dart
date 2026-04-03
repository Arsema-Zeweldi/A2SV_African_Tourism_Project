import 'package:equatable/equatable.dart';

abstract class FeedEvent extends Equatable {
  const FeedEvent();

  @override
  List<Object?> get props => [];
}

class LoadPosts extends FeedEvent {
  final int page;
  const LoadPosts({this.page = 1});

  @override
  List<Object?> get props => [page];
}

class CreateNewPost extends FeedEvent {
  final String content;
  final String? mediaUrl;
  final String? mediaType;
  final String? location;
  final String? packageName;
  final List<String>? tags;

  const CreateNewPost({
    required this.content,
    this.mediaUrl,
    this.mediaType,
    this.location,
    this.packageName,
    this.tags,
  });

  @override
  List<Object?> get props => [content];
}

class TogglePostLike extends FeedEvent {
  final String postId;
  const TogglePostLike(this.postId);

  @override
  List<Object?> get props => [postId];
}
