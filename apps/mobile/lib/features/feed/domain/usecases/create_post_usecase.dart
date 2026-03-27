import 'package:dartz/dartz.dart';
import 'package:mobile/core/error/failures.dart';
import 'package:mobile/core/usecases/usecase.dart';
import 'package:mobile/features/feed/domain/entities/post_entity.dart';
import 'package:mobile/features/feed/domain/repositories/feed_repository.dart';

class CreatePostUsecase implements UseCase<Post, CreatePostParams> {
  final FeedRepository repository;

  CreatePostUsecase(this.repository);

  @override
  Future<Either<Failure, Post>> call(CreatePostParams params) {
    if (params.content.trim().isEmpty) {
      return Future.value(const Left(ServerFailure('Post content cannot be empty')));
    }
    return repository.createPost(
      content: params.content,
      mediaUrl: params.mediaUrl,
      mediaType: params.mediaType,
      location: params.location,
      packageName: params.packageName,
      tags: params.tags,
    );
  }
}

class CreatePostParams {
  final String content;
  final String? mediaUrl;
  final String? mediaType;
  final String? location;
  final String? packageName;
  final List<String>? tags;

  const CreatePostParams({
    required this.content,
    this.mediaUrl,
    this.mediaType,
    this.location,
    this.packageName,
    this.tags,
  });
}
