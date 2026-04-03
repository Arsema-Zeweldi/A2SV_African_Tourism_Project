import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile/features/packages/domain/entities/package_entity.dart';
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

  Future<void> _onGenerate(
      GenerateItineraryRequested event, Emitter<PlannerState> emit) async {
    emit(PlannerLoading());
    final result = await generateItineraryUsecase(event.request);
    result.fold(
      (failure) => emit(PlannerError(failure.message)),
      (itinerary) => emit(ItineraryGenerated(itinerary)),
    );
  }

  Future<void> _onSave(
    SaveItineraryRequested event,
    Emitter<PlannerState> emit,
  ) async {
    Itinerary? currentItinerary;
    if (state is ItineraryGenerated) {
      currentItinerary = (state as ItineraryGenerated).itinerary;
    }

    final result = await saveItineraryUsecase(event.itineraryData);

    result.fold(
      (failure) => emit(PlannerError(failure.message)),
      (savedItinerary) {
        final originalActivities = currentItinerary?.activities ?? [];

        final mergedItinerary = Itinerary(
          id: savedItinerary.id,
          userId: savedItinerary.userId,
          title: savedItinerary.title,
          description: savedItinerary.description,
          daysCount: savedItinerary.daysCount,
          nightsCount: savedItinerary.nightsCount,
          startDate: savedItinerary.startDate,
          endDate: savedItinerary.endDate,
          totalCostEst: savedItinerary.totalCostEst,
          createdAt: savedItinerary.createdAt,
          updatedAt: savedItinerary.updatedAt,
          activities: originalActivities, 
        );

        emit(ItineraryGenerated(mergedItinerary));
      },
    );
  }

  Future<void> _onLoadItineraries(
      LoadUserItineraries event, Emitter<PlannerState> emit) async {
    emit(PlannerLoading());
    final result = await plannerRepository.listItineraries();
    result.fold(
      (failure) => emit(PlannerError(failure.message)),
      (itineraries) => emit(UserItinerariesLoaded(itineraries)),
    );
  }
}
