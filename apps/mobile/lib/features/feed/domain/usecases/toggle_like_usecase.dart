import 'package:dartz/dartz.dart';
import 'package:mobile/core/error/failures.dart';
import 'package:mobile/core/usecases/usecase.dart';
import 'package:mobile/features/feed/domain/repositories/feed_repository.dart';

class ToggleLikeUsecase implements UseCase<bool, String> {
  final FeedRepository repository;

  ToggleLikeUsecase(this.repository);

  @override
  Future<Either<Failure, bool>> call(String postId) {
    return repository.toggleLike(postId);
  }
}
