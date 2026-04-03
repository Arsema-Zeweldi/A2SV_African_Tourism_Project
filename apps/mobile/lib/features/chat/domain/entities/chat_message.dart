import 'package:equatable/equatable.dart';

class ChatMessage extends Equatable {
  final String id;
  final String packageId;
  final String role; // 'user' or 'assistant'
  final String content;
  final DateTime createdAt;

  const ChatMessage({
    required this.id,
    required this.packageId,
    required this.role,
    required this.content,
    required this.createdAt,
  });

  bool get isUser => role == 'user';

  @override
  List<Object?> get props => [id, packageId, role, content, createdAt];
}
