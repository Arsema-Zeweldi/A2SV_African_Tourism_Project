import 'package:flutter/material.dart';
import 'package:mobile/core/constants/app_colors.dart';
import 'package:mobile/features/generated_itinerary/presentation/pages/itinerary_result_screen.dart';
import 'package:mobile/features/post/presentation/pages/new_post_screen.dart';
import 'package:mobile/main_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      routes: {
        '/new-post': (context) => const NewPostScreen(),
        '/itinerary-result-screen': (context) => const ItineraryResultScreen(),
      },
      theme: ThemeData(
        // scaffoldBackgroundColor: const Color(0xFFF8F7F5),
        scaffoldBackgroundColor: AppColors.scaffoldBackground,
        // scaffoldBackgroundColor: Colors.blue,
      ),
      home: const MainScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}
