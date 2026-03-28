import 'package:equatable/equatable.dart';
import 'package:mobile/features/feed/domain/entities/post_entity.dart';

abstract class FeedState extends Equatable {
  const FeedState();

  @override
  List<Object?> get props => [];
}

class FeedInitial extends FeedState {}

class FeedLoading extends FeedState {}

class FeedLoaded extends FeedState {
  final List<Post> posts;
  final int total;
  final int page;

  const FeedLoaded({required this.posts, required this.total, required this.page});

  @override
  List<Object?> get props => [posts, total, page];
}

class PostCreated extends FeedState {
  final Post post;
  const PostCreated(this.post);

  @override
  List<Object?> get props => [post];
}

class FeedError extends FeedState {
  final String message;
  const FeedError(this.message);

  @override
  List<Object?> get props => [message];
}
