import 'package:equatable/equatable.dart';
import 'package:mobile/features/packages/domain/entities/package_entity.dart';

abstract class PlannerState extends Equatable {
  const PlannerState();

  @override
  List<Object?> get props => [];
}

class PlannerInitial extends PlannerState {}

class PlannerLoading extends PlannerState {}

class ItineraryGenerated extends PlannerState {
  final Itinerary itinerary;
  const ItineraryGenerated(this.itinerary);

  @override
  List<Object?> get props => [itinerary];
}

class ItinerarySaved extends PlannerState {
  final Itinerary itinerary;
  const ItinerarySaved(this.itinerary);

  @override
  List<Object?> get props => [itinerary];
}

class UserItinerariesLoaded extends PlannerState {
  final List<Itinerary> itineraries;
  const UserItinerariesLoaded(this.itineraries);

  @override
  List<Object?> get props => [itineraries];
}

class PlannerError extends PlannerState {
  final String message;
  const PlannerError(this.message);

  @override
  List<Object?> get props => [message];
}
