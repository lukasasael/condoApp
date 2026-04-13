import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'api_client.dart';

class AuthProvider extends ChangeNotifier {
  bool _isAuthenticated = false;
  Map<String, dynamic>? _user;
  bool _isLoading = true;

  bool get isAuthenticated => _isAuthenticated;
  Map<String, dynamic>? get user => _user;
  bool get isLoading => _isLoading;

  AuthProvider() {
    _checkStatus();
  }

  Future<void> _checkStatus() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('access_token');
    
    if (token != null) {
      // In a real app we would check token validity or fetch self
      _isAuthenticated = true;
      _user = {
        'id': prefs.getString('user_id'),
        'condominioId': prefs.getString('user_condominioId'),
        'nome': prefs.getString('user_nome'),
        'role': prefs.getString('user_role'),
      };
    }
    _isLoading = false;
    notifyListeners();
  }

  Future<void> login(String email, String password) async {
    try {
      final res = await apiClient.post('/auth/login', {
        'email': email,
        'password': password,
      });

      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('access_token', res['access_token']);
      
      final u = res['user'];
      await prefs.setString('user_id', u['id']);
      await prefs.setString('user_condominioId', u['condominioId']);
      await prefs.setString('user_nome', u['nome']);
      await prefs.setString('user_role', u['role']);

      _isAuthenticated = true;
      _user = u;
      notifyListeners();
    } catch (e) {
      rethrow;
    }
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
    _isAuthenticated = false;
    _user = null;
    notifyListeners();
  }
}
