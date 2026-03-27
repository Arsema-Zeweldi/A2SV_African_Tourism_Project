import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/core/widgets/logo_header.dart';

class EditProfileScreen extends StatefulWidget {
  const EditProfileScreen({super.key});

  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  bool isSaved = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFDF9F3),
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
              padding: const EdgeInsets.all(24.0),
              child: Column(
                children: [
                  _buildProfileImagePicker(),
                  const SizedBox(height: 40),
                  _buildField("Full Name", "Amara Okafor"),
                  const SizedBox(height: 20),
                  _buildField("Bio",
                      "Safari enthusiast & photographer. Documenting the beauty of the Serengeti and beyond. 🦁📸",
                      isLong: true),
                  const SizedBox(height: 20),
                  _buildField("Location", "Nairobi, Kenya",
                      icon: Icons.location_on),
                  const SizedBox(height: 40),
                  SizedBox(
                    width: double.infinity,
                    height: 56,
                    child: ElevatedButton(
                      onPressed: () => setState(() => isSaved = true),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFF69435),
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(30)),
                        elevation: 5,
                      ),
                      child: Text(isSaved ? "Changes Saved" : "Save Changes",
                          style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: Colors.white)),
                    ),
                  ),
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
            onPressed: () => context.pop(),
          ),
          const Text(
            "Edit Profile",
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

  Widget _buildProfileImagePicker() {
    return Stack(
      alignment: Alignment.bottomRight,
      children: [
        Container(
          padding: const EdgeInsets.all(4),
          decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: Colors.orange, width: 2)),
          child: const CircleAvatar(
              radius: 65, backgroundColor: Color(0xFFF4C2C2)),
        ),
        Container(
          padding: const EdgeInsets.all(8),
          decoration:
              const BoxDecoration(color: Colors.orange, shape: BoxShape.circle),
          child: const Icon(Icons.camera_alt, color: Colors.white, size: 20),
        ),
      ],
    );
  }

  Widget _buildField(String label, String initialValue,
      {bool isLong = false, IconData? icon}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label,
            style: const TextStyle(color: Color(0xFF707EAE), fontSize: 14)),
        const SizedBox(height: 8),
        TextFormField(
          initialValue: initialValue,
          maxLines: isLong ? 5 : 1,
          decoration: InputDecoration(
            prefixIcon:
                icon != null ? Icon(icon, color: Colors.blueGrey[200]) : null,
            filled: true,
            fillColor: Colors.white,
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: const BorderSide(color: Color(0xFFE0E5F2)),
            ),
          ),
        ),
      ],
    );
  }
}
