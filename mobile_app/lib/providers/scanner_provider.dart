import 'package:flutter/material.dart';
import '../models/guest.dart';
import '../services/api_service.dart';

class ScannerProvider extends ChangeNotifier {
  final ApiService _apiService;

  ScannerProvider({required ApiService apiService}) : _apiService = apiService;

  bool _isLoading = false;
  ScanResult? _lastResult;
  String _manualCode = '';

  bool get isLoading => _isLoading;
  ScanResult? get lastResult => _lastResult;
  String get manualCode => _manualCode;

  void setManualCode(String code) {
    _manualCode = code.toUpperCase();
    notifyListeners();
  }

  void clearResult() {
    _lastResult = null;
    _manualCode = '';
    notifyListeners();
  }

  Future<void> verifyCode(String code) async {
    _isLoading = true;
    notifyListeners();

    try {
      _lastResult = await _apiService.verifyCode(code);
    } catch (e) {
      _lastResult = ScanResult(
        success: false,
        message: 'Error: ${e.toString()}',
      );
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> checkInGuest(String code) async {
    _isLoading = true;
    notifyListeners();

    try {
      _lastResult = await _apiService.checkInGuest(code);
      if (_lastResult!.success) {
        _manualCode = '';
      }
    } catch (e) {
      _lastResult = ScanResult(
        success: false,
        message: 'Error: ${e.toString()}',
      );
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> verifyManualCode() async {
    if (_manualCode.isEmpty) return;
    await verifyCode(_manualCode);
  }

  Future<void> checkInManualCode() async {
    if (_manualCode.isEmpty) return;
    await checkInGuest(_manualCode);
  }
}
