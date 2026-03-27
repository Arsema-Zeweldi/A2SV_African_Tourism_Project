import 'package:flutter/material.dart';

// class ImageUploadPlaceholder extends StatelessWidget {
//   final VoidCallback onTap;

//   const ImageUploadPlaceholder({super.key, required this.onTap});

//   @override
//   Widget build(BuildContext context) {
//     return InkWell(
//       onTap: onTap,
//       borderRadius: BorderRadius.circular(20),
//       child: Container(
//         height: 220,
//         width: double.infinity,
//         decoration: BoxDecoration(
//           color: const Color(0xFFF8F9FA),
//           borderRadius: BorderRadius.circular(20),
//           border: Border.all(color: Colors.grey.shade300, style: BorderStyle.solid),
//         ),
//         child: Column(
//           mainAxisAlignment: MainAxisAlignment.center,
//           children: [
//             Container(
//               padding: const EdgeInsets.all(16),
//               decoration: BoxDecoration(
//                 color: Colors.orange.withValues(alpha: .1),
//                 shape: BoxShape.circle,
//               ),
//               child: const Icon(Icons.add_photo_alternate_outlined, color: Colors.orange, size: 32),
//             ),
//             const SizedBox(height: 16),
//             const Text("Add photos or videos", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
//             const SizedBox(height: 4),
//             Text("Up to 10 files (max 500MB)", style: TextStyle(color: Colors.grey.shade500, fontSize: 12)),
//           ],
//         ),
//       ),
//     );
//   }
// }

import 'dart:io';
import 'package:image_picker/image_picker.dart';

class InteractiveImageUploader extends StatefulWidget {
  const InteractiveImageUploader({super.key});

  @override
  State<InteractiveImageUploader> createState() =>
      _InteractiveImageUploaderState();
}

class _InteractiveImageUploaderState extends State<InteractiveImageUploader> {
  File? _selectedImage;
  final ImagePicker _picker = ImagePicker();

  Future<void> _pickImage() async {
    showModalBottomSheet(
      context: context,
      builder: (BuildContext context) {
        return SafeArea(
          child: Wrap(
            children: [
              ListTile(
                leading: const Icon(Icons.photo_library),
                title: const Text('Choose from Gallery'),
                onTap: () async {
                  Navigator.pop(context);
                  final XFile? image = await _picker.pickImage(
                    source: ImageSource.gallery,
                    imageQuality: 80,
                  );
                  if (image != null) {
                    setState(() {
                      _selectedImage = File(image.path);
                    });
                  }
                },
              ),
              ListTile(
                leading: const Icon(Icons.camera_alt),
                title: const Text('Take a Photo'),
                onTap: () async {
                  Navigator.pop(context);
                  final XFile? image = await _picker.pickImage(
                    source: ImageSource.camera,
                    imageQuality: 80,
                  );
                  if (image != null) {
                    setState(() {
                      _selectedImage = File(image.path);
                    });
                  }
                },
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: _pickImage,
      child: Container(
        height: 250,
        width: double.infinity,
        decoration: BoxDecoration(
          color: Colors.grey[100],
          borderRadius: BorderRadius.circular(30),
          border: Border.all(color: Colors.grey[300]!),
          
          image: _selectedImage != null
              ? DecorationImage(
                  image: FileImage(_selectedImage!),
                  fit: BoxFit.cover,
                )
              : null,
        ),
        child: _selectedImage == null
            ? Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.orange.withValues(alpha: .1),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.add_photo_alternate_rounded,
                        color: Colors.orange, size: 32),
                  ),
                  const SizedBox(height: 16),
                  const Text("Add photos or videos",
                      style:
                          TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  const SizedBox(height: 4),
                  Text("Up to 10 files (max 500MB)",
                      style:
                          TextStyle(color: Colors.grey.shade500, fontSize: 12)),
                ],
              )
            : Stack(
                fit: StackFit.expand,
                children: [
                  Positioned(
                    top: 8,
                    right: 8,
                    child: GestureDetector(
                      onTap: () {
                        setState(() {
                          _selectedImage = null;
                        });
                      },
                      child: Container(
                        padding: const EdgeInsets.all(4),
                        decoration: const BoxDecoration(
                          color: Colors.black54,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.close,
                          color: Colors.white,
                          size: 20,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
      ),
    );
  }
}
