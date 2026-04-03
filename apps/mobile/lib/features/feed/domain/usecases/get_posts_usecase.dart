import 'package:dartz/dartz.dart';
import 'package:mobile/core/error/failures.dart';
import 'package:mobile/core/usecases/usecase.dart';
import 'package:mobile/features/feed/domain/entities/post_entity.dart';
import 'package:mobile/features/feed/domain/repositories/feed_repository.dart';

class GetPostsUsecase implements UseCase<PaginatedPosts, GetPostsParams> {
  final FeedRepository repository;

  GetPostsUsecase(this.repository);

  @override
  Future<Either<Failure, PaginatedPosts>> call(GetPostsParams params) {
    return repository.listPosts(page: params.page, pageSize: params.pageSize);
  }
}

class GetPostsParams {
  final int page;
  final int pageSize;

  const GetPostsParams({this.page = 1, this.pageSize = 20});
}
