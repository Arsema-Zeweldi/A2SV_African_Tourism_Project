import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ApiInterceptor extends Interceptor  {
  final SharedPreferences sharedPreferences;

  ApiInterceptor({required this.sharedPreferences});

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    final token = sharedPreferences.getString('auth_token');
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }

    options.headers['Content-Type'] = 'application/json';
    options.headers['Accept'] = 'application/json';

    print('➡️ REQUEST[${options.method}] => PATH: ${options.path}');
    print('Headers: ${options.headers}');

    if (options.data != null) {
      print('Body: ${options.data}');
    }

    super.onRequest(options, handler);
  }

  @override
  void onResponse(Response response, ResponseInterceptorHandler handler) {
     print('✅ RESPONSE[${response.statusCode}] => PATH: ${response.requestOptions.path}');
     print('Data: ${response.data}');    
    super.onResponse(response, handler);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    print('❌ ERROR[${err.response?.statusCode}] => PATH: ${err.requestOptions.path}');
    print('Message: ${err.message}');
    
    if (err.response?.statusCode == 401) {
      sharedPreferences.remove('AUTH_TOKEN');
      sharedPreferences.remove('CACHED_USER');
    }
    
    super.onError(err, handler);
  }
}