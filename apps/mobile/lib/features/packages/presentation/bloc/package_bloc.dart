import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile/features/packages/domain/usecases/get_my_packages_usecase.dart';
import 'package:mobile/features/packages/domain/usecases/get_package_detail_usecase.dart';
import 'package:mobile/features/packages/domain/usecases/get_packages_feed_usecase.dart';
import 'package:mobile/features/packages/domain/usecases/submit_review_usecase.dart';
import 'package:mobile/features/packages/domain/repositories/package_repository.dart';

import 'package_event.dart';
import 'package_state.dart';

class PackageBloc extends Bloc<PackageEvent, PackageState> {
  final GetPackagesFeedUsecase getPackagesFeedUsecase;
  final GetPackageDetailUsecase getPackageDetailUsecase;
  final GetMyPackagesUsecase getMyPackagesUsecase;
  final SubmitReviewUsecase submitReviewUsecase;
  final PackageRepository packageRepository;

  PackageBloc({
    required this.getPackagesFeedUsecase,
    required this.getPackageDetailUsecase,
    required this.getMyPackagesUsecase,
    required this.submitReviewUsecase,
    required this.packageRepository,
  }) : super(PackageInitial()) {
    on<LoadPackagesFeed>(_onLoadPackagesFeed);
    on<LoadPackageDetail>(_onLoadPackageDetail);
    on<LoadMyPackages>(_onLoadMyPackages);
    on<SubmitPackageReview>(_onSubmitReview);
    on<UpdatePackageStatus>(_onUpdatePackageStatus);
  }

  Future<void> _onLoadPackagesFeed(
    LoadPackagesFeed event,
    Emitter<PackageState> emit,
  ) async {
    emit(PackageLoading());

    final result = await getPackagesFeedUsecase(PackageFeedParams(
      sortBy: event.sortBy,
      order: event.order,
      query: event.query,
      page: event.page,
    ));

    result.fold(
      (failure) => emit(PackageError(failure.message)),
      (paginated) => emit(PackageFeedLoaded(
        packages: paginated.packages,
        total: paginated.total,
        page: paginated.page,
      )),
    );
  }

  Future<void> _onLoadPackageDetail(
    LoadPackageDetail event,
    Emitter<PackageState> emit,
  ) async {
    emit(PackageLoading());

    final result = await getPackageDetailUsecase(event.packageId);

    result.fold(
      (failure) => emit(PackageError(failure.message)),
      (package) => emit(PackageDetailLoaded(package)),
    );
  }

  Future<void> _onLoadMyPackages(
    LoadMyPackages event,
    Emitter<PackageState> emit,
  ) async {
    emit(PackageLoading());

    final result = await getMyPackagesUsecase(MyPackagesParams(
      query: event.query,
      page: event.page,
    ));

    result.fold(
      (failure) => emit(PackageError(failure.message)),
      (paginated) => emit(MyPackagesLoaded(
        packages: paginated.packages,
        total: paginated.total,
      )),
    );
  }

  Future<void> _onSubmitReview(
    SubmitPackageReview event,
    Emitter<PackageState> emit,
  ) async {
    emit(PackageLoading());

    final result = await submitReviewUsecase(SubmitReviewParams(
      packageId: event.packageId,
      rating: event.rating,
      comment: event.comment,
    ));

    result.fold(
      (failure) => emit(PackageError(failure.message)),
      (_) => emit(ReviewSubmitted()),
    );
  }

  Future<void> _onUpdatePackageStatus(
    UpdatePackageStatus event,
    Emitter<PackageState> emit,
  ) async {
    emit(PackageLoading());

    final result = await packageRepository.updatePackageStatus(
      event.packageId,
      event.status,
    );

    result.fold(
      (failure) => emit(PackageError(failure.message)),
      (_) => emit(PackageStatusUpdated()),
    );
  }
}
