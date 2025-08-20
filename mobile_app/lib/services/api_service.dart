import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/guest.dart';

class ApiService {
  // Change this to your backend URL
  static const String baseUrl = 'http://localhost:8080/api';

  Future<ScanResult> verifyCode(String code) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/qr-codes/verify'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'code': code}),
      );

      final data = jsonDecode(response.body);
      return ScanResult.fromJson(data);
    } catch (e) {
      return ScanResult(
        success: false,
        message: 'Network error: ${e.toString()}',
      );
    }
  }

  Future<ScanResult> checkInGuest(String code) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/qr-codes/checkin'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'code': code}),
      );

      final data = jsonDecode(response.body);
      return ScanResult.fromJson(data);
    } catch (e) {
      return ScanResult(
        success: false,
        message: 'Network error: ${e.toString()}',
      );
    }
  }
}
