import 'package:flutter/material.dart';
import 'package:mobile/features/my_packages/domain/entities/user_packages.dart';
import 'package:mobile/features/my_packages/presentation/widgets/my_packages_card.dart';

class MyPackageList extends StatelessWidget {
  MyPackageList({super.key});

  final List<UserPackage> packages= [
    UserPackage(
      title: "Zanzibar Retreat",
      duration: "7 Days / 6 Nights",
      dateRange: "Nov 12 - Nov 19, 2024",
      imagePath: 'assets/images/top_rated2.png',
      status: PackageStatus.upcoming,
      isPublic: true,
    ),
    UserPackage(
      title: "Cape Town Vibes",
      duration: "4 Days / 3 Nights",
      dateRange: "Completed",
      imagePath: 'assets/images/top_rated1.png',
      status: PackageStatus.completed,
      isPublic: true,
      rating: 5.0,
    ),
  ];

  
  @override
  Widget build(BuildContext context) {
    return Column(
    children: packages.map((p) => MyPackagesCard(package: p)).toList(),
  );

  }
}