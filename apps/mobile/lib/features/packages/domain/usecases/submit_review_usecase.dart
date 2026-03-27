import 'package:dartz/dartz.dart';
import 'package:mobile/core/error/failures.dart';
import 'package:mobile/core/usecases/usecase.dart';
import 'package:mobile/features/packages/domain/repositories/package_repository.dart';

class SubmitReviewUsecase implements UseCase<void, SubmitReviewParams> {
  final PackageRepository repository;

  SubmitReviewUsecase(this.repository);

  @override
  Future<Either<Failure, void>> call(SubmitReviewParams params) {
    if (params.rating < 1 || params.rating > 5) {
      return Future.value(const Left(ServerFailure('Rating must be between 1 and 5')));
    }
    return repository.submitReview(
      params.packageId,
      rating: params.rating,
      comment: params.comment,
    );
  }
}

class SubmitReviewParams {
  final String packageId;
  final double rating;
  final String comment;

  const SubmitReviewParams({
    required this.packageId,
    required this.rating,
    this.comment = '',
  });
}
