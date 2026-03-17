import 'package:flutter/material.dart';
import 'package:mobile/core/widgets/logo_header.dart';
import 'package:mobile/features/profile/presentation/widgets/profile_status_card.dart';
import 'edit_profile_screen.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          const SafeArea(
            child: Padding(
              padding: EdgeInsets.only(top: 16.0, bottom: 8.0),
              child: LogoHeader(),
            ),
          ),
          
          _buildCustomAppBar(context),
          
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  const CircleAvatar(
                      radius: 60, backgroundColor: Color(0xFFF4C2C2)),
                  const SizedBox(height: 16),
                  const Text("Amara Okafor",
                      style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
                  const Text("Nairobi, Kenya",
                      style: TextStyle(color: Colors.orange)),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 12),
                    child: Text(
                      "Safari enthusiast & photographer. Documenting the beauty of the Serengeti and beyond. 🦁📸",
                      textAlign: TextAlign.center,
                      style: TextStyle(color: Colors.grey[600]),
                    ),
                  ),
                  const SizedBox(height: 32),
                  const SummaryCard(trips: "24", posts: "142"),
                  const SizedBox(height: 24),
                  _buildEditButton(context),
                  const SizedBox(height: 24),
                  _buildTabBar(),
                  _buildPostsGrid(),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCustomAppBar(BuildContext context) {
    return Container(
      color: Colors.transparent,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          IconButton(
            icon: const Icon(Icons.arrow_back_ios_new,
                color: Colors.black, size: 20),
            onPressed: () => Navigator.pop(context),
          ),
          const Text(
            "Profile",
            style: TextStyle(
              color: Color(0xFF1B254B),
              fontWeight: FontWeight.bold,
              fontSize: 18,
            ),
          ),
          const SizedBox(width: 40), 
        ],
      ),
    );
  }

  Widget _buildEditButton(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 50,
      
      child: ElevatedButton.icon(
        onPressed: () => Navigator.push(context,
            MaterialPageRoute(builder: (_) => const EditProfileScreen())),
        icon: const Icon(Icons.edit, size: 18),
        label: const Text("Edit Profile"),
        style: OutlinedButton.styleFrom(
          foregroundColor: Colors.white,
          backgroundColor: Colors.orange,
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(25)),
        ),
      ),
    );
  }

  Widget _buildTabBar() {
    return Row(
      children: [
        Expanded(
            child: Column(children: [
          const Text("My Posts", style: TextStyle(fontWeight: FontWeight.bold)),
          Container(
              height: 2,
              color: Colors.orange,
              margin: const EdgeInsets.only(top: 8))
        ])),
        const Expanded(
            child: Center(
                child: Text("Travel Stats",
                    style: TextStyle(color: Colors.grey)))),
      ],
    );
  }

  Widget _buildPostsGrid() {
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 3, crossAxisSpacing: 5, mainAxisSpacing: 5),
      itemCount: 9,
      itemBuilder: (context, index) => Container(color: Colors.grey[300]),
    );
  }
}