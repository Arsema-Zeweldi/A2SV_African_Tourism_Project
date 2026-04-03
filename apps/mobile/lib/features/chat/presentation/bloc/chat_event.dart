import 'package:equatable/equatable.dart';

abstract class ChatEvent extends Equatable {
  const ChatEvent();

  @override
  List<Object?> get props => [];
}

class LoadChatHistory extends ChatEvent {
  final String packageId;
  const LoadChatHistory(this.packageId);

  @override
  List<Object?> get props => [packageId];
}

class SendChatMessage extends ChatEvent {
  final String packageId;
  final String message;
  const SendChatMessage({required this.packageId, required this.message});

  @override
  List<Object?> get props => [packageId, message];
}
