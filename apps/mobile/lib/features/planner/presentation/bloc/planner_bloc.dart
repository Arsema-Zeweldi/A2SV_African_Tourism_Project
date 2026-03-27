import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile/features/planner/domain/repositories/planner_repository.dart';
import 'package:mobile/features/planner/domain/usecases/generate_itinerary_usecase.dart';
import 'package:mobile/features/planner/domain/usecases/save_itinerary_usecase.dart';

import 'planner_event.dart';
import 'planner_state.dart';

class PlannerBloc extends Bloc<PlannerEvent, PlannerState> {
  final GenerateItineraryUsecase generateItineraryUsecase;
  final SaveItineraryUsecase saveItineraryUsecase;
  final PlannerRepository plannerRepository;

  PlannerBloc({
    required this.generateItineraryUsecase,
    required this.saveItineraryUsecase,
    required this.plannerRepository,
  }) : super(PlannerInitial()) {
    on<GenerateItineraryRequested>(_onGenerate);
    on<SaveItineraryRequested>(_onSave);
    on<LoadUserItineraries>(_onLoadItineraries);
  }

  Future<void> _onGenerate(GenerateItineraryRequested event, Emitter<PlannerState> emit) async {
    emit(PlannerLoading());
    final result = await generateItineraryUsecase(event.request);
    result.fold(
      (failure) => emit(PlannerError(failure.message)),
      (itinerary) => emit(ItineraryGenerated(itinerary)),
    );
  }

  Future<void> _onSave(SaveItineraryRequested event, Emitter<PlannerState> emit) async {
    emit(PlannerLoading());
    final result = await saveItineraryUsecase(event.itineraryData);
    result.fold(
      (failure) => emit(PlannerError(failure.message)),
      (itinerary) => emit(ItinerarySaved(itinerary)),
    );
  }

  Future<void> _onLoadItineraries(LoadUserItineraries event, Emitter<PlannerState> emit) async {
    emit(PlannerLoading());
    final result = await plannerRepository.listItineraries();
    result.fold(
      (failure) => emit(PlannerError(failure.message)),
      (itineraries) => emit(UserItinerariesLoaded(itineraries)),
    );
  }
}
