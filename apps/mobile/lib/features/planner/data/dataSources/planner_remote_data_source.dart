import 'package:mobile/core/constants/api_endpoints.dart';
import 'package:mobile/core/network/api_client.dart';
import 'package:mobile/core/network/exceptions.dart';
import 'package:mobile/features/packages/data/models/package_model.dart';

abstract class PlannerRemoteDataSource {
  /// POST /planner/generate
  Future<ItineraryModel> generateItinerary(Map<String, dynamic> request);

  /// POST /itineraries — save an itinerary
  Future<ItineraryModel> saveItinerary(Map<String, dynamic> request);

  /// GET /itineraries — list user's itineraries
  Future<List<ItineraryModel>> listItineraries();

  /// GET /itineraries/:id
  Future<ItineraryModel> getItinerary(String id);

  /// DELETE /itineraries/:id
  Future<void> deleteItinerary(String id);
}

class PlannerRemoteDataSourceImpl implements PlannerRemoteDataSource {
  final ApiClient apiClient;

  PlannerRemoteDataSourceImpl({required this.apiClient});

  @override
  Future<ItineraryModel> generateItinerary(Map<String, dynamic> request) async {
    try {
      final response = await apiClient.post(
        ApiEndpoints.generateItinerary,
        data: request,
      );
      final data = response.data;
      // The response may be wrapped in "data" or returned directly
      final itineraryJson = data['data'] ?? data;
      return ItineraryModel.fromJson(itineraryJson as Map<String, dynamic>);
    } on ApiException {
      rethrow;
    } on NetworkException {
      rethrow;
    } catch (e) {
      throw ApiException(message: 'Failed to generate itinerary: ${e.toString()}');
    }
  }

  @override
  Future<ItineraryModel> saveItinerary(Map<String, dynamic> request) async {
    try {
      final response = await apiClient.post(ApiEndpoints.itineraries, data: request);
      final data = response.data;
      final itineraryJson = data['data'] ?? data;
      return ItineraryModel.fromJson(itineraryJson as Map<String, dynamic>);
    } on ApiException {
      rethrow;
    } on NetworkException {
      rethrow;
    } catch (e) {
      throw ApiException(message: 'Failed to save itinerary: ${e.toString()}');
    }
  }

  @override
  Future<List<ItineraryModel>> listItineraries() async {
    try {
      final response = await apiClient.get(ApiEndpoints.itineraries);
      final data = response.data;
      final List<dynamic> itinerariesJson = data['data'] ?? [];
      return itinerariesJson.map((j) => ItineraryModel.fromJson(j as Map<String, dynamic>)).toList();
    } on ApiException {
      rethrow;
    } on NetworkException {
      rethrow;
    } catch (e) {
      throw ApiException(message: 'Failed to load itineraries: ${e.toString()}');
    }
  }

  @override
  Future<ItineraryModel> getItinerary(String id) async {
    try {
      final response = await apiClient.get('${ApiEndpoints.itineraries}/$id');
      final data = response.data;
      final itineraryJson = data['data'] ?? data;
      return ItineraryModel.fromJson(itineraryJson as Map<String, dynamic>);
    } on ApiException {
      rethrow;
    } on NetworkException {
      rethrow;
    } catch (e) {
      throw ApiException(message: 'Failed to load itinerary: ${e.toString()}');
    }
  }

  @override
  Future<void> deleteItinerary(String id) async {
    try {
      await apiClient.delete('${ApiEndpoints.itineraries}/$id');
    } on ApiException {
      rethrow;
    } on NetworkException {
      rethrow;
    } catch (e) {
      throw ApiException(message: 'Failed to delete itinerary: ${e.toString()}');
    }
  }
}
