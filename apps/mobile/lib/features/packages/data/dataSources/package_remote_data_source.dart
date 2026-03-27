import 'package:mobile/core/constants/api_endpoints.dart';
import 'package:mobile/core/network/api_client.dart';
import 'package:mobile/core/network/exceptions.dart';
import 'package:mobile/features/packages/data/models/package_model.dart';

abstract class PackageRemoteDataSource {
  /// GET /packages?sort_by=...&order=...&page=...&page_size=...
  Future<({List<TravelPackageModel> packages, int total})> getPackagesFeed({
    String? sortBy,
    String? order,
    String? query,
    int page = 1,
    int pageSize = 20,
  });

  /// GET /packages/:id
  Future<TravelPackageModel> getPackageById(String id);

  /// GET /packages/me
  Future<({List<TravelPackageModel> packages, int total})> getMyPackages({
    String? query,
    int page = 1,
    int pageSize = 20,
  });

  /// GET /packages/:id/reviews
  Future<List<PackageReviewModel>> getPackageReviews(String packageId, {int page, int pageSize});

  /// POST /packages/:id/reviews
  Future<void> submitReview(String packageId, {required double rating, String comment = ''});

  /// PATCH /packages/:id/status
  Future<void> updatePackageStatus(String packageId, String status);
}

class PackageRemoteDataSourceImpl implements PackageRemoteDataSource {
  final ApiClient apiClient;

  PackageRemoteDataSourceImpl({required this.apiClient});

  @override
  Future<({List<TravelPackageModel> packages, int total})> getPackagesFeed({
    String? sortBy,
    String? order,
    String? query,
    int page = 1,
    int pageSize = 20,
  }) async {
    try {
      final queryParams = <String, dynamic>{
        'page': page,
        'page_size': pageSize,
      };
      if (sortBy != null) queryParams['sort_by'] = sortBy;
      if (order != null) queryParams['order'] = order;
      if (query != null && query.isNotEmpty) queryParams['q'] = query;

      final response = await apiClient.get(
        ApiEndpoints.packages,
        queryParameters: queryParams,
      );

      final data = response.data;
      final List<dynamic> packagesJson = data['data'] ?? [];
      final meta = data['meta'] ?? {};

      final packages = packagesJson
          .map((json) => TravelPackageModel.fromJson(json as Map<String, dynamic>))
          .toList();

      final total = (meta['total'] ?? packages.length) as int;
      return (packages: packages, total: total);
    } on ApiException {
      rethrow;
    } on NetworkException {
      rethrow;
    } catch (e) {
      throw ApiException(message: 'Failed to load packages: ${e.toString()}');
    }
  }

  @override
  Future<TravelPackageModel> getPackageById(String id) async {
    try {
      final response = await apiClient.get('${ApiEndpoints.packages}/$id');
      final data = response.data;

      // Handle wrapped or unwrapped response
      final packageJson = data['data'] ?? data;
      return TravelPackageModel.fromJson(packageJson as Map<String, dynamic>);
    } on ApiException {
      rethrow;
    } on NetworkException {
      rethrow;
    } catch (e) {
      throw ApiException(message: 'Failed to load package: ${e.toString()}');
    }
  }

  @override
  Future<({List<TravelPackageModel> packages, int total})> getMyPackages({
    String? query,
    int page = 1,
    int pageSize = 20,
  }) async {
    try {
      final queryParams = <String, dynamic>{
        'page': page,
        'page_size': pageSize,
      };
      if (query != null && query.isNotEmpty) queryParams['q'] = query;

      final response = await apiClient.get(
        '${ApiEndpoints.packages}/me',
        queryParameters: queryParams,
      );

      final data = response.data;
      final List<dynamic> packagesJson = data['data'] ?? [];
      final meta = data['meta'] ?? {};

      final packages = packagesJson
          .map((json) => TravelPackageModel.fromJson(json as Map<String, dynamic>))
          .toList();

      final total = (meta['total'] ?? packages.length) as int;
      return (packages: packages, total: total);
    } on ApiException {
      rethrow;
    } on NetworkException {
      rethrow;
    } catch (e) {
      throw ApiException(message: 'Failed to load my packages: ${e.toString()}');
    }
  }

  @override
  Future<List<PackageReviewModel>> getPackageReviews(
    String packageId, {
    int page = 1,
    int pageSize = 50,
  }) async {
    try {
      final response = await apiClient.get(
        '${ApiEndpoints.packages}/$packageId/reviews',
        queryParameters: {'page': page, 'page_size': pageSize},
      );

      final data = response.data;
      final List<dynamic> reviewsJson = data['data'] ?? [];
      return reviewsJson
          .map((json) => PackageReviewModel.fromJson(json as Map<String, dynamic>))
          .toList();
    } on ApiException {
      rethrow;
    } on NetworkException {
      rethrow;
    } catch (e) {
      throw ApiException(message: 'Failed to load reviews: ${e.toString()}');
    }
  }

  @override
  Future<void> submitReview(
    String packageId, {
    required double rating,
    String comment = '',
  }) async {
    try {
      await apiClient.post(
        '${ApiEndpoints.packages}/$packageId/reviews',
        data: {'rating': rating, 'comment': comment},
      );
    } on ApiException {
      rethrow;
    } on NetworkException {
      rethrow;
    } catch (e) {
      throw ApiException(message: 'Failed to submit review: ${e.toString()}');
    }
  }

  @override
  Future<void> updatePackageStatus(String packageId, String status) async {
    try {
      await apiClient.dio.patch(
        '${ApiEndpoints.packages}/$packageId/status',
        data: {'status': status},
      );
    } on ApiException {
      rethrow;
    } on NetworkException {
      rethrow;
    } catch (e) {
      throw ApiException(message: 'Failed to update status: ${e.toString()}');
    }
  }
}
