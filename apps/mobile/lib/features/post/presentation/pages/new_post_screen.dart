import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/core/constants/app_colors.dart';
import 'package:mobile/core/widgets/logo_header.dart';
import 'package:mobile/features/post/presentation/widgets/post_description_field.dart';
import 'package:mobile/features/post/presentation/widgets/post_toolbar.dart';
import 'package:mobile/features/post/presentation/widgets/trip_selector_item.dart';
import '../widgets/image_upload_placeholder.dart';

class NewPostScreen extends StatefulWidget {
  static const routeName = "/new-post";
  const NewPostScreen({super.key});

  @override
  State<NewPostScreen> createState() => _NewPostScreenState();
}

class _NewPostScreenState extends State<NewPostScreen> {
  final TextEditingController _controller = TextEditingController();
  int _charCount = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.scaffoldBackground,
      resizeToAvoidBottomInset: false,
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
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text("LINK TO YOUR TRIP",
                      style: TextStyle(
                          color: Colors.orange,
                          fontWeight: FontWeight.bold,
                          fontSize: 12)),
                  const SizedBox(height: 12),
                  SizedBox(
                    height: 70,
                    child: ListView(
                      scrollDirection: Axis.horizontal,
                      children: [
                        TripSelectorItem(
                          title: "Safari Adventure",
                          status: "In Progress",
                          imagePath: "assets/images/top_rated1.png",
                          isSelected: false,
                          onTap: () {},
                        ),
                        const SizedBox(width: 12),
                        TripSelectorItem(
                          title: "Beach Vacation",
                          status: "Planning",
                          imagePath: "assets/images/top_rated1.png",
                          isSelected: false,
                          onTap: () {},
                        ),
                        const SizedBox(width: 12),
                        TripSelectorItem(
                          title: "Mountain Hike",
                          status: "Completed",
                          imagePath: "assets/images/top_rated1.png",
                          isSelected: false,
                          onTap: () {},
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                  const InteractiveImageUploader(),
                  const SizedBox(height: 12),
                  PostDescriptionField(
                    controller: _controller,
                    onChanged: (val) => setState(() => _charCount = val.length),
                  ),
                  const Divider(),
                  _buildActionTile(
                      Icons.location_on_outlined, "Add location"),
                  const SizedBox(height: 12),
                  _buildActionTile(Icons.public, "Post to Feed"),
                ],
              ),
            ),
          ),
          PostToolbar(currentLength: _charCount),
        ],
      ),
    );
  }

  Widget _buildCustomAppBar(BuildContext context) {
    return Container(
      // color: Colors.white,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          TextButton(
            onPressed: () => context.pop(),
            child: const Text(
              "Cancel",
              style: TextStyle(color: Colors.blueGrey, fontSize: 16),
            ),
          ),
          const Text(
            "New Post",
            style: TextStyle(
              color: Colors.black,
              fontWeight: FontWeight.bold,
              fontSize: 18,
            ),
          ),
          ElevatedButton(
            onPressed: () {},
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.orange,
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
              ),
            ),
            child: const Text(
              "Post",
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionTile(IconData icon, String title) {
    return Padding(
      padding: const EdgeInsets.all(0),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(30),
          border: Border.all(color: Colors.grey.shade100),
        ),
        child: ListTile(
          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
          leading: CircleAvatar(
            backgroundColor: const Color(0xFFF8F9FA),
            child: Icon(icon, color: Colors.orange, size: 20),
          ),
          title: Text(title, style: const TextStyle(fontWeight: FontWeight.w600)),
          trailing: const Icon(Icons.expand_more, color: Colors.grey),
        ),
      ),
    );
  }
}
