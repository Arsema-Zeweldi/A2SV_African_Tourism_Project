import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile/features/feed/domain/usecases/create_post_usecase.dart';
import 'package:mobile/features/feed/domain/usecases/get_posts_usecase.dart';
import 'package:mobile/features/feed/domain/usecases/toggle_like_usecase.dart';

import 'feed_event.dart';
import 'feed_state.dart';

class FeedBloc extends Bloc<FeedEvent, FeedState> {
  final GetPostsUsecase getPostsUsecase;
  final CreatePostUsecase createPostUsecase;
  final ToggleLikeUsecase toggleLikeUsecase;

  FeedBloc({
    required this.getPostsUsecase,
    required this.createPostUsecase,
    required this.toggleLikeUsecase,
  }) : super(FeedInitial()) {
    on<LoadPosts>(_onLoadPosts);
    on<CreateNewPost>(_onCreatePost);
    on<TogglePostLike>(_onToggleLike);
  }

  Future<void> _onLoadPosts(LoadPosts event, Emitter<FeedState> emit) async {
    emit(FeedLoading());
    final result = await getPostsUsecase(GetPostsParams(page: event.page));
    result.fold(
      (failure) => emit(FeedError(failure.message)),
      (paginated) => emit(FeedLoaded(posts: paginated.posts, total: paginated.total, page: paginated.page)),
    );
  }

  Future<void> _onCreatePost(CreateNewPost event, Emitter<FeedState> emit) async {
    emit(FeedLoading());
    final result = await createPostUsecase(CreatePostParams(
      content: event.content,
      mediaUrl: event.mediaUrl,
      mediaType: event.mediaType,
      location: event.location,
      packageName: event.packageName,
      tags: event.tags,
    ));
    result.fold(
      (failure) => emit(FeedError(failure.message)),
      (post) => emit(PostCreated(post)),
    );
  }

  Future<void> _onToggleLike(TogglePostLike event, Emitter<FeedState> emit) async {
    // Optimistic — just call the API and reload posts
    await toggleLikeUsecase(event.postId);
    add(const LoadPosts());
  }
}
