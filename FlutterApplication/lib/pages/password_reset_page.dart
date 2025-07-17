import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'package:logger/logger.dart';
import 'login_page.dart';

final RegExp passwordRegex = RegExp(r"^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$");

var logger = Logger(output: null);

class PasswordResetPage extends StatefulWidget {
  const PasswordResetPage({super.key});

  @override
  State<PasswordResetPage> createState() => _PasswordResetState();
}

class _PasswordResetState extends State<PasswordResetPage> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _confirmController = TextEditingController();
  String _errorMessage = '';
  bool _isLoading = false;

  Future<void> _passwordReset() async {
    setState(() {
      _isLoading = true;
      _errorMessage = '';
    });

    if (_isValidPassword(passwordRegex)) {
      if (_isConfirmMatch()) {
        try {
          final response = await http.post(
            Uri.parse('${dotenv.env['VITE_API_URL']}/auth/forgot-password'),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({
              'email': _emailController.text,
              'password': _passwordController.text,
            }),
          );

          final data = jsonDecode(response.body);

          if (response.statusCode == 201 && (data['error'] == null || data['error'].isEmpty)) {
            setState(() {
              _errorMessage = 'Email Sent Successful. Check email for password instructions.';
            });
          } else {
            setState(() {
              _errorMessage = 'Error sending email';
            });
          }
        } catch (e) {
          setState(() {
            _errorMessage = 'Network error. Please check your connection.';
          });
        } finally {
          setState(() {
            _isLoading = false;
          });
        }
      } else {
        setState(() {
          _errorMessage = 'Passwords must match.';
          _isLoading = false;
        });
      }
    } else {
      setState(() {
        _errorMessage = 'Password must be at least 8 characters and include a special character and a number.';
        _isLoading = false;
      });
    }
  }

  bool _isValidPassword(RegExp regex) => regex.hasMatch(_passwordController.text);
  bool _isConfirmMatch() => _confirmController.text == _passwordController.text;

  void _redirectLogin() {
    if (mounted) {
      Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => const LoginPage()));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(32.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text('Forgot Password', style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold), textAlign: TextAlign.center),
              TextField(controller: _emailController, decoration: const InputDecoration(labelText: 'Email', border: OutlineInputBorder())),
              const SizedBox(height: 16),
              TextField(controller: _passwordController, obscureText: true, decoration: const InputDecoration(labelText: 'Password', border: OutlineInputBorder())),
              const SizedBox(height: 16),
              TextField(controller: _confirmController, obscureText: true, decoration: const InputDecoration(labelText: 'Confirm Password', border: OutlineInputBorder())),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: _isLoading ? null : _passwordReset,
                style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 16)),
                child: _isLoading ? const CircularProgressIndicator() : const Text('Submit', style: TextStyle(fontSize: 16)),
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: _redirectLogin,
                style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 16)),
                child: _isLoading ? const CircularProgressIndicator() : const Text('Return to Login', style: TextStyle(fontSize: 16)),
              ),
              const SizedBox(height: 16),
              if (_errorMessage.isNotEmpty)
                Text(_errorMessage, style: const TextStyle(color: Colors.red, fontSize: 14), textAlign: TextAlign.center),
            ],
          ),
        ),
      ),
    );
  }
  
}