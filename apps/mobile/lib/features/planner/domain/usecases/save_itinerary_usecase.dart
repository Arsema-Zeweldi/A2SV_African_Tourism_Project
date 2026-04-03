import 'package:dartz/dartz.dart';
import 'package:mobile/core/error/failures.dart';
import 'package:mobile/core/usecases/usecase.dart';
import 'package:mobile/features/packages/domain/entities/package_entity.dart';
import 'package:mobile/features/planner/domain/repositories/planner_repository.dart';

class SaveItineraryUsecase implements UseCase<Itinerary, Map<String, dynamic>> {
  final PlannerRepository repository;

  SaveItineraryUsecase(this.repository);

  @override
  Future<Either<Failure, Itinerary>> call(Map<String, dynamic> params) {
    return repository.saveItinerary(params);
  }
}
