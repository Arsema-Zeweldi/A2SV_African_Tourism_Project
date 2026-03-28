import 'package:equatable/equatable.dart';
import 'package:mobile/features/packages/domain/entities/package_entity.dart';

abstract class PackageState extends Equatable {
  const PackageState();

  @override
  List<Object?> get props => [];
}

/// Initial state — nothing loaded yet.
class PackageInitial extends PackageState {}

/// Loading packages feed or detail.
class PackageLoading extends PackageState {}

/// Feed loaded successfully.
class PackageFeedLoaded extends PackageState {
  final List<TravelPackage> packages;
  final int total;
  final int page;

  const PackageFeedLoaded({
    required this.packages,
    required this.total,
    required this.page,
  });

  @override
  List<Object?> get props => [packages, total, page];
}

/// Single package detail loaded.
class PackageDetailLoaded extends PackageState {
  final TravelPackage package;

  const PackageDetailLoaded(this.package);

  @override
  List<Object?> get props => [package];
}

/// My packages loaded.
class MyPackagesLoaded extends PackageState {
  final List<TravelPackage> packages;
  final int total;

  const MyPackagesLoaded({required this.packages, required this.total});

  @override
  List<Object?> get props => [packages, total];
}

/// Review submitted successfully.
class ReviewSubmitted extends PackageState {}

/// Package status updated.
class PackageStatusUpdated extends PackageState {}

/// An error occurred.
class PackageError extends PackageState {
  final String message;

  const PackageError(this.message);

  @override
  List<Object?> get props => [message];
}
