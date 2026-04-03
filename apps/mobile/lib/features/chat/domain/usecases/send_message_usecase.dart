import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import 'package:mobile/core/error/failures.dart';
import 'package:mobile/core/usecases/usecase.dart';
import 'package:mobile/features/chat/domain/entities/chat_message.dart';
import 'package:mobile/features/chat/domain/repositories/chat_repository.dart';

class SendMessageUsecase extends UseCase<ChatMessage, SendMessageParams> {
  final ChatRepository repository;

  SendMessageUsecase(this.repository);

  @override
  Future<Either<Failure, ChatMessage>> call(SendMessageParams params) {
    if (params.message.trim().isEmpty) {
      return Future.value(const Left(ServerFailure('Message cannot be empty')));
    }
    if (params.message.length > 4096) {
      return Future.value(const Left(ServerFailure('Message is too long (max 4096 characters)')));
    }
    return repository.sendMessage(params.packageId, params.message);
  }
}

class SendMessageParams extends Equatable {
  final String packageId;
  final String message;

  const SendMessageParams({required this.packageId, required this.message});

  @override
  List<Object?> get props => [packageId, message];
}
