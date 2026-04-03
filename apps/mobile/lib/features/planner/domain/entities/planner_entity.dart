import 'package:equatable/equatable.dart';
import 'package:mobile/features/packages/domain/entities/package_entity.dart';

class GeneratePlanRequest extends Equatable {
  final String destination;
  final int durationDays;
  final double? budget;
  final String? budgetLevel;
  final List<String> vibeTags;
  final int? groupSize;
  final String? climatePref;
  final bool? multiCountry;
  final String? notes;

  const GeneratePlanRequest({
    required this.destination,
    required this.durationDays,
    this.budget,
    this.budgetLevel,
    this.vibeTags = const [],
    this.groupSize,
    this.climatePref,
    this.multiCountry,
    this.notes,
  });

  Map<String, dynamic> toJson() {
    final map = <String, dynamic>{
      'destination': destination,
      'duration_days': durationDays,
    };
    if (budget != null) map['budget'] = budget;
    if (budgetLevel != null) map['budget_level'] = budgetLevel;
    if (vibeTags.isNotEmpty) map['vibe_tags'] = vibeTags;
    if (groupSize != null) map['group_size'] = groupSize;
    if (climatePref != null) map['climate_pref'] = climatePref;
    if (multiCountry != null) map['multi_country'] = multiCountry;
    if (notes != null && notes!.isNotEmpty) map['notes'] = notes;
    return map;
  }

  @override
  List<Object?> get props => [destination, durationDays];
}

/// Reuse Itinerary from packages feature since the shape is the same.
typedef GeneratedItinerary = Itinerary;
