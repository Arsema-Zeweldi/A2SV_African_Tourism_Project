import 'package:dartz/dartz.dart';
import 'package:mobile/core/error/failures.dart';
import 'package:mobile/features/feed/domain/entities/post_entity.dart';

abstract class FeedRepository {
  Future<Either<Failure, PaginatedPosts>> listPosts({int page, int pageSize});
  Future<Either<Failure, Post>> createPost({required String content, String? mediaUrl, String? mediaType, String? location, String? packageName, List<String>? tags});
  Future<Either<Failure, List<PostComment>>> listComments(String postId);
  Future<Either<Failure, PostComment>> addComment(String postId, {required String text});
  Future<Either<Failure, bool>> toggleLike(String postId);
}
