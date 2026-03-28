import 'package:equatable/equatable.dart';

abstract class PackageEvent extends Equatable {
  const PackageEvent();

  @override
  List<Object?> get props => [];
}

/// Load the public packages feed (home page + marketplace).
class LoadPackagesFeed extends PackageEvent {
  final String? sortBy;
  final String? order;
  final String? query;
  final int page;

  const LoadPackagesFeed({
    this.sortBy,
    this.order,
    this.query,
    this.page = 1,
  });

  @override
  List<Object?> get props => [sortBy, order, query, page];
}

/// Load a single package's full details.
class LoadPackageDetail extends PackageEvent {
  final String packageId;

  const LoadPackageDetail(this.packageId);

  @override
  List<Object?> get props => [packageId];
}

/// Load the current user's own packages.
class LoadMyPackages extends PackageEvent {
  final String? query;
  final int page;

  const LoadMyPackages({this.query, this.page = 1});

  @override
  List<Object?> get props => [query, page];
}

/// Submit a review for a package.
class SubmitPackageReview extends PackageEvent {
  final String packageId;
  final double rating;
  final String comment;

  const SubmitPackageReview({
    required this.packageId,
    required this.rating,
    this.comment = '',
  });

  @override
  List<Object?> get props => [packageId, rating, comment];
}

/// Toggle package visibility (public/private).
class UpdatePackageStatus extends PackageEvent {
  final String packageId;
  final String status;

  const UpdatePackageStatus({required this.packageId, required this.status});

  @override
  List<Object?> get props => [packageId, status];
}
