class NetworkException implements Exception {
  final String message;
  NetworkException(this.message);
}

class ApiException implements Exception {
  final String message;
  final int? statusCode;
  ApiException({required this.message, this.statusCode});
}

class UnauthorizedException implements Exception {
  final String message;
  UnauthorizedException([this.message = 'Session expired']);
}

class CancellationException implements Exception {
  final String message;
  CancellationException(this.message);
}

class TimeoutException implements Exception {
  final String message;
  TimeoutException(this.message);
}
