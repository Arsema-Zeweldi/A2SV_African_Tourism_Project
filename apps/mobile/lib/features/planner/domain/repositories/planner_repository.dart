import 'package:dartz/dartz.dart';
import 'package:mobile/core/error/failures.dart';
import 'package:mobile/features/packages/domain/entities/package_entity.dart';

abstract class PlannerRepository {
  Future<Either<Failure, Itinerary>> generateItinerary(Map<String, dynamic> request);
  Future<Either<Failure, Itinerary>> saveItinerary(Map<String, dynamic> request);
  Future<Either<Failure, List<Itinerary>>> listItineraries();
  Future<Either<Failure, Itinerary>> getItinerary(String id);
  Future<Either<Failure, void>> deleteItinerary(String id);
}
