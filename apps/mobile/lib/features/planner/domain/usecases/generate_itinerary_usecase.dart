import 'package:dartz/dartz.dart';
import 'package:mobile/core/error/failures.dart';
import 'package:mobile/core/usecases/usecase.dart';
import 'package:mobile/features/packages/domain/entities/package_entity.dart';
import 'package:mobile/features/planner/domain/entities/planner_entity.dart';
import 'package:mobile/features/planner/domain/repositories/planner_repository.dart';

class GenerateItineraryUsecase implements UseCase<Itinerary, GeneratePlanRequest> {
  final PlannerRepository repository;

  GenerateItineraryUsecase(this.repository);

  @override
  Future<Either<Failure, Itinerary>> call(GeneratePlanRequest params) {
    if (params.destination.trim().isEmpty) {
      return Future.value(const Left(ServerFailure('Destination is required')));
    }
    if (params.durationDays < 1) {
      return Future.value(const Left(ServerFailure('Duration must be at least 1 day')));
    }
    return repository.generateItinerary(params.toJson());
  }
}
