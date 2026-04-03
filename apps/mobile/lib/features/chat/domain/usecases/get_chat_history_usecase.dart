import 'package:dartz/dartz.dart';
import 'package:mobile/core/error/failures.dart';
import 'package:mobile/core/usecases/usecase.dart';
import 'package:mobile/features/chat/domain/entities/chat_message.dart';
import 'package:mobile/features/chat/domain/repositories/chat_repository.dart';

class GetChatHistoryUsecase extends UseCase<List<ChatMessage>, String> {
  final ChatRepository repository;

  GetChatHistoryUsecase(this.repository);

  @override
  Future<Either<Failure, List<ChatMessage>>> call(String packageId) {
    return repository.getChatHistory(packageId);
  }
}
