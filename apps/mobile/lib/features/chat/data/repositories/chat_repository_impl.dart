import 'package:dartz/dartz.dart';
import 'package:mobile/core/error/failures.dart';
import 'package:mobile/core/network/exceptions.dart';
import 'package:mobile/features/chat/data/dataSources/chat_remote_data_source.dart';
import 'package:mobile/features/chat/domain/entities/chat_message.dart';
import 'package:mobile/features/chat/domain/repositories/chat_repository.dart';

class ChatRepositoryImpl implements ChatRepository {
  final ChatRemoteDataSource remoteDataSource;

  ChatRepositoryImpl({required this.remoteDataSource});

  @override
  Future<Either<Failure, List<ChatMessage>>> getChatHistory(String packageId) async {
    try {
      final result = await remoteDataSource.getChatHistory(packageId);
      return Right(result);
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } on TimeoutException catch (e) {
      return Left(TimeoutFailure(e.message));
    } on ApiException catch (e) {
      return Left(ServerFailure(e.message));
    } catch (e) {
      return Left(ServerFailure('An unexpected error occurred. Please try again.'));
    }
  }

  @override
  Future<Either<Failure, ChatMessage>> sendMessage(String packageId, String message) async {
    try {
      final result = await remoteDataSource.sendMessage(packageId, message);
      return Right(result);
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } on TimeoutException catch (e) {
      return Left(TimeoutFailure(e.message));
    } on ApiException catch (e) {
      return Left(ServerFailure(e.message));
    } catch (e) {
      return Left(ServerFailure('An unexpected error occurred. Please try again.'));
    }
  }
}
