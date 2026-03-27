/// API endpoint paths and base URL configuration.
///
/// To connect to the real backend, update [baseUrl] to point to
/// your deployed server (e.g., 'https://your-server.com/api/v1').
/// For local development, use 'http://10.0.2.2:8080/api/v1' (Android emulator)
/// or 'http://localhost:8080/api/v1' (iOS simulator / web).
class ApiEndpoints {
  // ── Base URL ─────────────────────────────────────────────────
  // TODO: Replace with your actual deployed backend URL.
  static const String baseUrl = 'http://10.0.2.2:8080/api/v1';

  // ── Auth ─────────────────────────────────────────────────────
  static const String signUp = '/auth/register'; // Backend uses /register not /signup
  static const String login = '/auth/login';
  static const String logout = '/auth/logout';
  static const String googleSignIn = '/auth/google';
  static const String getCurrentUser = '/user/profile';
  static const String resetPassword = '/auth/reset-password';

  // ── User Profile ─────────────────────────────────────────────
  static const String profile = '/user/profile';
  static const String preferences = '/user/preferences';

  // ── AI Planner ───────────────────────────────────────────────
  static const String generateItinerary = '/planner/generate';

  // ── Packages / Marketplace ───────────────────────────────────
  static const String packages = '/packages';

  // ── Itineraries ──────────────────────────────────────────────
  static const String itineraries = '/itineraries';

  // ── Community / Feed ─────────────────────────────────────────
  static const String posts = '/posts';

  // ── File Upload ──────────────────────────────────────────────
  static const String uploadImage = '/upload/image';
  static const String uploadVideo = '/upload/video';
}
