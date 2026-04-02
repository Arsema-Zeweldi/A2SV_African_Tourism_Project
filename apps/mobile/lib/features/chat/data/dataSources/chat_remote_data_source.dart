import 'package:mobile/core/constants/api_endpoints.dart';
import 'package:mobile/core/network/api_client.dart';
import 'package:mobile/core/network/exceptions.dart';
import 'package:mobile/features/chat/data/models/chat_message_model.dart';

abstract class ChatRemoteDataSource {
  Future<List<ChatMessageModel>> getChatHistory(String packageId);
  Future<ChatMessageModel> sendMessage(String packageId, String message);
}

class ChatRemoteDataSourceImpl implements ChatRemoteDataSource {
  final ApiClient apiClient;

  ChatRemoteDataSourceImpl({required this.apiClient});

  @override
  Future<List<ChatMessageModel>> getChatHistory(String packageId) async {
    try {
      final response = await apiClient.get(
        ApiEndpoints.packageChat(packageId),
      );
      final data = response.data;
      final List<dynamic> messagesJson = data['data'] ?? data['messages'] ?? [];
      return messagesJson
          .map((j) => ChatMessageModel.fromJson(j as Map<String, dynamic>))
          .toList();
    } on ApiException {
      rethrow;
    } on NetworkException {
      rethrow;
    } catch (e) {
      throw ApiException(message: 'Failed to load chat history: ${e.toString()}');
    }
  }

  @override
  Future<ChatMessageModel> sendMessage(String packageId, String message) async {
    try {
      final response = await apiClient.post(
        ApiEndpoints.packageChat(packageId),
        data: {'message': message},
      );
      final data = response.data;
      final messageJson = data['data'] ?? data;
      return ChatMessageModel.fromJson(messageJson as Map<String, dynamic>);
    } on ApiException {
      rethrow;
    } on NetworkException {
      rethrow;
    } catch (e) {
      throw ApiException(message: 'Failed to send message: ${e.toString()}');
    }
  }
}
