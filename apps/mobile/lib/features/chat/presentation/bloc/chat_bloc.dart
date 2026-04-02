import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile/features/chat/domain/entities/chat_message.dart';
import 'package:mobile/features/chat/domain/usecases/get_chat_history_usecase.dart';
import 'package:mobile/features/chat/domain/usecases/send_message_usecase.dart';
import 'package:mobile/features/chat/presentation/bloc/chat_event.dart';
import 'package:mobile/features/chat/presentation/bloc/chat_state.dart';

class ChatBloc extends Bloc<ChatEvent, ChatState> {
  final GetChatHistoryUsecase getChatHistoryUsecase;
  final SendMessageUsecase sendMessageUsecase;

  ChatBloc({
    required this.getChatHistoryUsecase,
    required this.sendMessageUsecase,
  }) : super(ChatInitial()) {
    on<LoadChatHistory>(_onLoadChatHistory);
    on<SendChatMessage>(_onSendMessage);
  }

  Future<void> _onLoadChatHistory(
    LoadChatHistory event,
    Emitter<ChatState> emit,
  ) async {
    emit(ChatLoading());
    final result = await getChatHistoryUsecase(event.packageId);
    result.fold(
      (failure) => emit(ChatError(failure.message)),
      (messages) => emit(ChatLoaded(messages)),
    );
  }

  Future<void> _onSendMessage(
    SendChatMessage event,
    Emitter<ChatState> emit,
  ) async {
    // Preserve current messages while sending
    final currentMessages = _currentMessages;

    // Add the user's message optimistically
    final userMessage = ChatMessage(
      id: 'temp_${DateTime.now().millisecondsSinceEpoch}',
      packageId: event.packageId,
      role: 'user',
      content: event.message,
      createdAt: DateTime.now(),
    );
    final updatedMessages = [...currentMessages, userMessage];
    emit(ChatSending(updatedMessages));

    final result = await sendMessageUsecase(
      SendMessageParams(packageId: event.packageId, message: event.message),
    );
    result.fold(
      (failure) => emit(ChatError(failure.message, previousMessages: updatedMessages)),
      (aiResponse) => emit(ChatLoaded([...updatedMessages, aiResponse])),
    );
  }

  List<ChatMessage> get _currentMessages {
    final s = state;
    if (s is ChatLoaded) return s.messages;
    if (s is ChatSending) return s.messages;
    if (s is ChatError) return s.previousMessages;
    return [];
  }
}
