import 'package:dartz/dartz.dart';
import 'package:mobile/core/error/failures.dart';
import 'package:mobile/features/chat/domain/entities/chat_message.dart';

abstract class ChatRepository {
  Future<Either<Failure, List<ChatMessage>>> getChatHistory(String packageId);
  Future<Either<Failure, ChatMessage>> sendMessage(String packageId, String message);
}
