import 'package:equatable/equatable.dart';
import 'package:mobile/features/planner/domain/entities/planner_entity.dart';

abstract class PlannerEvent extends Equatable {
  const PlannerEvent();

  @override
  List<Object?> get props => [];
}

class GenerateItineraryRequested extends PlannerEvent {
  final GeneratePlanRequest request;
  const GenerateItineraryRequested(this.request);

  @override
  List<Object?> get props => [request];
}

class SaveItineraryRequested extends PlannerEvent {
  final Map<String, dynamic> itineraryData;
  const SaveItineraryRequested(this.itineraryData);

  @override
  List<Object?> get props => [itineraryData];
}

class LoadUserItineraries extends PlannerEvent {}
