/// API endpoint paths and base URL configuration.
///
/// The backend is deployed on Render. For local development, swap [baseUrl]
/// back to 'http://10.0.2.2:8080/api/v1' (Android emulator)
/// or 'http://localhost:8080/api/v1' (iOS simulator / web).
class ApiEndpoints {
  // ── Base URL ─────────────────────────────────────────────────
  static const String baseUrl =
      'https://africa-tourism-backend.onrender.com/api/v1';

  // ── Auth ─────────────────────────────────────────────────────
  static const String signUp = '/auth/register';
  static const String login = '/auth/login';
  static const String logout = '/auth/logout';
  static const String googleSignIn = '/auth/google';
  static const String getCurrentUser = '/user/profile';

  /// Sends a password-reset email (the "forgot password" flow).
  /// Backend: POST /auth/forgot-password  { "email": "..." }
  static const String forgotPassword = '/auth/forgot-password';

  /// Actually resets the password using a token received via email.
  /// Backend: POST /auth/reset-password  { "token": "...", "new_password": "..." }
  static const String resetPassword = '/auth/reset-password';

  /// Resend the email-verification link.
  /// Backend: POST /auth/resend-verification  { "email": "..." }
  static const String resendVerification = '/auth/resend-verification';

  // ── User Profile ─────────────────────────────────────────────
  static const String profile = '/user/profile';
  static const String preferences = '/user/preferences';
  static const String changePassword = '/user/change-password';

  // ── AI Planner ───────────────────────────────────────────────
  static const String generateItinerary = '/planner/generate';

  // ── Packages / Marketplace ───────────────────────────────────
  static const String packages = '/packages';

  // ── Itineraries ──────────────────────────────────────────────
  static const String itineraries = '/itineraries';

  // ── Community / Feed ─────────────────────────────────────────
  static const String posts = '/posts';

  // ── Package Chat ────────────────────────────────────────────
  /// GET /packages/:id/chat — chat history (public)
  /// POST /packages/:id/chat — send message (auth required)
  static String packageChat(String packageId) => '/packages/$packageId/chat';

  // ── File Upload ──────────────────────────────────────────────
  static const String uploadImage = '/upload/image';
  static const String uploadVideo = '/upload/video';
}
