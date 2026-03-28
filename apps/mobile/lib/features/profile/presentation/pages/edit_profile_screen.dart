import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/core/widgets/logo_header.dart';
import 'package:mobile/features/profile/presentation/bloc/profile_bloc.dart';
import 'package:mobile/features/profile/presentation/bloc/profile_event.dart';
import 'package:mobile/features/profile/presentation/bloc/profile_state.dart';

class EditProfileScreen extends StatefulWidget {
  const EditProfileScreen({super.key});

  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  bool isSaved = false;
  late TextEditingController _nameController;
  late TextEditingController _bioController;
  late TextEditingController _locationController;
  String? _avatarUrl;

  @override
  void initState() {
    super.initState();
    final state = context.read<ProfileBloc>().state;
    String name = 'Amara Okafor';
    String bio = "Safari enthusiast & photographer. Documenting the beauty of the Serengeti and beyond. 🦁📸";
    String location = 'Nairobi, Kenya';

    if (state is ProfileLoaded) {
      name = state.profile.fullName.isNotEmpty ? state.profile.fullName : name;
      bio = state.profile.bio.isNotEmpty ? state.profile.bio : bio;
      location = state.profile.country.isNotEmpty ? state.profile.country : location;
      _avatarUrl = state.profile.avatarUrl.isNotEmpty ? state.profile.avatarUrl : null;
    } else if (state is ProfileUpdated) {
      name = state.profile.fullName.isNotEmpty ? state.profile.fullName : name;
      bio = state.profile.bio.isNotEmpty ? state.profile.bio : bio;
      location = state.profile.country.isNotEmpty ? state.profile.country : location;
      _avatarUrl = state.profile.avatarUrl.isNotEmpty ? state.profile.avatarUrl : null;
    }

    _nameController = TextEditingController(text: name);
    _bioController = TextEditingController(text: bio);
    _locationController = TextEditingController(text: location);
  }

  @override
  void dispose() {
    _nameController.dispose();
    _bioController.dispose();
    _locationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<ProfileBloc, ProfileState>(
      listener: (context, state) {
        if (state is ProfileUpdated) {
          setState(() => isSaved = true);
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: const Text('Profile updated successfully!'),
              backgroundColor: Colors.green,
              behavior: SnackBarBehavior.floating,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
          );
        } else if (state is ProfileError) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(state.message), backgroundColor: Colors.red),
          );
        }
      },
      child: Scaffold(
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
                    _buildField("Full Name", _nameController),
                    const SizedBox(height: 20),
                    _buildField("Bio", _bioController, isLong: true),
                    const SizedBox(height: 20),
                    _buildField("Location", _locationController,
                        icon: Icons.location_on),
                    const SizedBox(height: 40),
                    BlocBuilder<ProfileBloc, ProfileState>(
                      builder: (context, state) {
                        final isLoading = state is ProfileLoading;
                        return SizedBox(
                          width: double.infinity,
                          height: 56,
                          child: ElevatedButton(
                            onPressed: isLoading ? null : _onSave,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFFF69435),
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(30)),
                              elevation: 5,
                            ),
                            child: isLoading
                                ? const SizedBox(
                                    width: 24,
                                    height: 24,
                                    child: CircularProgressIndicator(
                                        color: Colors.white, strokeWidth: 2),
                                  )
                                : Text(
                                    isSaved ? "Changes Saved" : "Save Changes",
                                    style: const TextStyle(
                                        fontSize: 18,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.white)),
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _onSave() {
    final nameParts = _nameController.text.trim().split(' ');
    final firstName = nameParts.first;
    final lastName = nameParts.length > 1 ? nameParts.sublist(1).join(' ') : '';

    context.read<ProfileBloc>().add(UpdateProfileRequested(
      firstName: firstName,
      lastName: lastName,
      country: _locationController.text.trim(),
      bio: _bioController.text.trim(),
    ));
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
          child: CircleAvatar(
            radius: 65,
            backgroundColor: const Color(0xFFF4C2C2),
            backgroundImage: _avatarUrl != null ? NetworkImage(_avatarUrl!) : null,
          ),
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

  Widget _buildField(String label, TextEditingController controller,
      {bool isLong = false, IconData? icon}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label,
            style: const TextStyle(color: Color(0xFF707EAE), fontSize: 14)),
        const SizedBox(height: 8),
        TextFormField(
          controller: controller,
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
