import 'package:equatable/equatable.dart';
import 'package:mobile/features/chat/domain/entities/chat_message.dart';

abstract class ChatState extends Equatable {
  const ChatState();

  @override
  List<Object?> get props => [];
}

class ChatInitial extends ChatState {}

class ChatLoading extends ChatState {}

class ChatLoaded extends ChatState {
  final List<ChatMessage> messages;
  const ChatLoaded(this.messages);

  @override
  List<Object?> get props => [messages];
}

class ChatSending extends ChatState {
  final List<ChatMessage> messages;
  const ChatSending(this.messages);

  @override
  List<Object?> get props => [messages];
}

class ChatError extends ChatState {
  final String message;
  final List<ChatMessage> previousMessages;
  const ChatError(this.message, {this.previousMessages = const []});

  @override
  List<Object?> get props => [message, previousMessages];
}
