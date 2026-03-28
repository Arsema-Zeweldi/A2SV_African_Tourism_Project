import 'package:mobile/core/constants/api_endpoints.dart';
import 'package:mobile/core/network/api_client.dart';
import 'package:mobile/core/network/exceptions.dart';
import 'package:mobile/features/feed/data/models/post_model.dart';

abstract class FeedRemoteDataSource {
  Future<({List<PostModel> posts, int total})> listPosts({int page, int pageSize});
  Future<PostModel> getPost(String id);
  Future<PostModel> createPost({required String content, String? mediaUrl, String? mediaType, String? location, String? packageName, List<String>? tags});
  Future<List<PostCommentModel>> listComments(String postId, {int page, int pageSize});
  Future<PostCommentModel> addComment(String postId, {required String text});
  Future<bool> toggleLike(String postId);
}

class FeedRemoteDataSourceImpl implements FeedRemoteDataSource {
  final ApiClient apiClient;

  FeedRemoteDataSourceImpl({required this.apiClient});

  @override
  Future<({List<PostModel> posts, int total})> listPosts({int page = 1, int pageSize = 20}) async {
    try {
      final response = await apiClient.get(
        ApiEndpoints.posts,
        queryParameters: {'page': page, 'page_size': pageSize},
      );
      final data = response.data;
      final List<dynamic> postsJson = data['data'] ?? [];
      final meta = data['meta'] ?? {};
      final posts = postsJson.map((j) => PostModel.fromJson(j as Map<String, dynamic>)).toList();
      final total = (meta['total'] ?? posts.length) as int;
      return (posts: posts, total: total);
    } on ApiException {
      rethrow;
    } on NetworkException {
      rethrow;
    } catch (e) {
      throw ApiException(message: 'Failed to load posts: ${e.toString()}');
    }
  }

  @override
  Future<PostModel> getPost(String id) async {
    try {
      final response = await apiClient.get('${ApiEndpoints.posts}/$id');
      final data = response.data;
      final postJson = data['data'] ?? data;
      return PostModel.fromJson(postJson as Map<String, dynamic>);
    } on ApiException {
      rethrow;
    } on NetworkException {
      rethrow;
    } catch (e) {
      throw ApiException(message: 'Failed to load post: ${e.toString()}');
    }
  }

  @override
  Future<PostModel> createPost({
    required String content,
    String? mediaUrl,
    String? mediaType,
    String? location,
    String? packageName,
    List<String>? tags,
  }) async {
    try {
      final body = <String, dynamic>{'content': content};
      if (mediaUrl != null) body['media_url'] = mediaUrl;
      if (mediaType != null) body['media_type'] = mediaType;
      if (location != null) body['location'] = location;
      if (packageName != null) body['package_name'] = packageName;
      if (tags != null) body['tags'] = tags;

      final response = await apiClient.post(ApiEndpoints.posts, data: body);
      final data = response.data;
      final postJson = data['data'] ?? data;
      return PostModel.fromJson(postJson as Map<String, dynamic>);
    } on ApiException {
      rethrow;
    } on NetworkException {
      rethrow;
    } catch (e) {
      throw ApiException(message: 'Failed to create post: ${e.toString()}');
    }
  }

  @override
  Future<List<PostCommentModel>> listComments(String postId, {int page = 1, int pageSize = 50}) async {
    try {
      final response = await apiClient.get(
        '${ApiEndpoints.posts}/$postId/comments',
        queryParameters: {'page': page, 'page_size': pageSize},
      );
      final data = response.data;
      final List<dynamic> commentsJson = data['data'] ?? [];
      return commentsJson.map((j) => PostCommentModel.fromJson(j as Map<String, dynamic>)).toList();
    } on ApiException {
      rethrow;
    } on NetworkException {
      rethrow;
    } catch (e) {
      throw ApiException(message: 'Failed to load comments: ${e.toString()}');
    }
  }

  @override
  Future<PostCommentModel> addComment(String postId, {required String text}) async {
    try {
      final response = await apiClient.post(
        '${ApiEndpoints.posts}/$postId/comments',
        data: {'text': text},
      );
      final data = response.data;
      final commentJson = data['data'] ?? data;
      return PostCommentModel.fromJson(commentJson as Map<String, dynamic>);
    } on ApiException {
      rethrow;
    } on NetworkException {
      rethrow;
    } catch (e) {
      throw ApiException(message: 'Failed to add comment: ${e.toString()}');
    }
  }

  @override
  Future<bool> toggleLike(String postId) async {
    try {
      final response = await apiClient.post('${ApiEndpoints.posts}/$postId/like');
      return response.data['liked'] ?? false;
    } on ApiException {
      rethrow;
    } on NetworkException {
      rethrow;
    } catch (e) {
      throw ApiException(message: 'Failed to toggle like: ${e.toString()}');
    }
  }
}
