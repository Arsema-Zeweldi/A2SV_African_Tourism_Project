import 'package:dartz/dartz.dart';
import 'package:mobile/core/error/failures.dart';
import 'package:mobile/core/network/exceptions.dart';
import 'package:mobile/features/feed/data/dataSources/feed_remote_data_source.dart';
import 'package:mobile/features/feed/domain/entities/post_entity.dart';
import 'package:mobile/features/feed/domain/repositories/feed_repository.dart';

class FeedRepositoryImpl implements FeedRepository {
  final FeedRemoteDataSource remoteDataSource;

  FeedRepositoryImpl({required this.remoteDataSource});

  @override
  Future<Either<Failure, PaginatedPosts>> listPosts({int page = 1, int pageSize = 20}) async {
    try {
      final result = await remoteDataSource.listPosts(page: page, pageSize: pageSize);
      return Right(PaginatedPosts(posts: result.posts, total: result.total, page: page, pageSize: pageSize));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } on TimeoutException catch (e) {
      return Left(TimeoutFailure(e.message));
    } on ApiException catch (e) {
      return Left(ServerFailure(e.message));
    } catch (e) {
      return Left(ServerFailure('An unexpected error occurred. Please try again.'));
    }
  }

  @override
  Future<Either<Failure, Post>> createPost({
    required String content,
    String? mediaUrl,
    String? mediaType,
    String? location,
    String? packageName,
    List<String>? tags,
  }) async {
    try {
      final result = await remoteDataSource.createPost(
        content: content,
        mediaUrl: mediaUrl,
        mediaType: mediaType,
        location: location,
        packageName: packageName,
        tags: tags,
      );
      return Right(result);
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } on TimeoutException catch (e) {
      return Left(TimeoutFailure(e.message));
    } on ApiException catch (e) {
      return Left(ServerFailure(e.message));
    } catch (e) {
      return Left(ServerFailure('An unexpected error occurred. Please try again.'));
    }
  }

  @override
  Future<Either<Failure, List<PostComment>>> listComments(String postId) async {
    try {
      final result = await remoteDataSource.listComments(postId);
      return Right(result);
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } on TimeoutException catch (e) {
      return Left(TimeoutFailure(e.message));
    } on ApiException catch (e) {
      return Left(ServerFailure(e.message));
    } catch (e) {
      return Left(ServerFailure('An unexpected error occurred. Please try again.'));
    }
  }

  @override
  Future<Either<Failure, PostComment>> addComment(String postId, {required String text}) async {
    try {
      final result = await remoteDataSource.addComment(postId, text: text);
      return Right(result);
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } on TimeoutException catch (e) {
      return Left(TimeoutFailure(e.message));
    } on ApiException catch (e) {
      return Left(ServerFailure(e.message));
    } catch (e) {
      return Left(ServerFailure('An unexpected error occurred. Please try again.'));
    }
  }

  @override
  Future<Either<Failure, bool>> toggleLike(String postId) async {
    try {
      final result = await remoteDataSource.toggleLike(postId);
      return Right(result);
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } on TimeoutException catch (e) {
      return Left(TimeoutFailure(e.message));
    } on ApiException catch (e) {
      return Left(ServerFailure(e.message));
    } catch (e) {
      return Left(ServerFailure('An unexpected error occurred. Please try again.'));
    }
  }
}
