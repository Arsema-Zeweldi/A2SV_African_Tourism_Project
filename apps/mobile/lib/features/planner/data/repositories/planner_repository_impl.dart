import 'package:dartz/dartz.dart';
import 'package:mobile/core/error/failures.dart';
import 'package:mobile/core/network/exceptions.dart';
import 'package:mobile/features/packages/domain/entities/package_entity.dart';
import 'package:mobile/features/planner/data/dataSources/planner_remote_data_source.dart';
import 'package:mobile/features/planner/domain/repositories/planner_repository.dart';

class PlannerRepositoryImpl implements PlannerRepository {
  final PlannerRemoteDataSource remoteDataSource;

  PlannerRepositoryImpl({required this.remoteDataSource});

  @override
  Future<Either<Failure, Itinerary>> generateItinerary(Map<String, dynamic> request) async {
    try {
      final result = await remoteDataSource.generateItinerary(request);
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
  Future<Either<Failure, Itinerary>> saveItinerary(Map<String, dynamic> request) async {
    try {
      final result = await remoteDataSource.saveItinerary(request);
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
  Future<Either<Failure, List<Itinerary>>> listItineraries() async {
    try {
      final result = await remoteDataSource.listItineraries();
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
  Future<Either<Failure, Itinerary>> getItinerary(String id) async {
    try {
      final result = await remoteDataSource.getItinerary(id);
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
  Future<Either<Failure, void>> deleteItinerary(String id) async {
    try {
      await remoteDataSource.deleteItinerary(id);
      return const Right(null);
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
