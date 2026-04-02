import 'package:mobile/features/chat/domain/entities/chat_message.dart';

class ChatMessageModel extends ChatMessage {
  const ChatMessageModel({
    required super.id,
    required super.packageId,
    required super.role,
    required super.content,
    required super.createdAt,
  });

  factory ChatMessageModel.fromJson(Map<String, dynamic> json) {
    return ChatMessageModel(
      id: json['id']?.toString() ?? json['message_id']?.toString() ?? '',
      packageId: json['package_id']?.toString() ?? '',
      role: json['role']?.toString() ?? 'assistant',
      content: json['content']?.toString() ?? json['message']?.toString() ?? '',
      createdAt: json['created_at'] != null
          ? DateTime.tryParse(json['created_at'].toString()) ?? DateTime.now()
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'package_id': packageId,
      'role': role,
      'content': content,
      'created_at': createdAt.toIso8601String(),
    };
  }
}
