import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import '../error/failures.dart';

// Type = What the UseCase returns (e.g., User, List<Trip>)
// Params = What the UseCase needs to execute (e.g., LoginParams, NoParams)
abstract class UseCase<Type, Params> {
  Future<Either<Failure, Type>> call(Params params);
}

// Use this when the UseCase doesn't need any input (e.g., getting a list of cached trips)
class NoParams extends Equatable {
  @override
  List<Object> get props => [];
}