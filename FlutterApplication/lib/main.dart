import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:table_calendar/table_calendar.dart';
import 'event.dart';

const List<String> emotions = ['Neutral', 'Happy', 'Angry', 'Sad'];
const List<Color> emotionColors = [Colors.blue, Colors.yellow, Colors.red, Colors.purple];
RegExp passwordRegex = RegExp(r"^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$");

Future main() async {
  await dotenv.load(fileName: ".env");
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'LoginPage Manager',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        useMaterial3: true,
      ),
      home: const LoginPage(),
    );
  }
}

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  String _errorMessage = '';
  bool _isLoading = false;

  Future<void> _login() async {
    setState(() {
      _isLoading = true;
      _errorMessage = '';
    });

    try {
      final response = await http.post(
        Uri.parse('${dotenv.env['VITE_API_URL']}/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': _emailController.text,
          'password': _passwordController.text,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        
        if (data['token'] != null || !data['token'].isEmpty) {
          // Login successful, navigate to second page
          if (mounted) {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(
                builder: (context) => CalendarPage(),
              ),
            );
          }
        } else {
          setState(() {
            _errorMessage = 'Please Register your account';
          });
        }
      } else {
        setState(() {
          _errorMessage = 'Login failed. Please try again.';
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
  }

  void _openRegister() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (context) => RegisterPage(),
      ),
    );
  }

  void _resetPassword() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (context) => LoginPage(),
      ),
    );
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
              const Text(
                'Login',
                style: TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 40),
              TextField(
                controller: _emailController,
                decoration: const InputDecoration(
                  labelText: 'Email',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _passwordController,
                obscureText: true,
                decoration: const InputDecoration(
                  labelText: 'Password',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: _isLoading ? null : _login,
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
                child: _isLoading
                    ? const CircularProgressIndicator()
                    : const Text(
                        'Login',
                        style: TextStyle(fontSize: 16),
                      ),
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: _openRegister,
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
                child: const Text(
                        'Register New User',
                        style: TextStyle(fontSize: 16),
                      ),
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: _resetPassword,
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
                child: const Text(
                        'Forgot Password',
                        style: TextStyle(fontSize: 16),
                      ),
              ),
              const SizedBox(height: 16),
              if (_errorMessage.isNotEmpty)
                Text(
                  _errorMessage,
                  style: const TextStyle(
                    color: Colors.red,
                    fontSize: 14,
                  ),
                  textAlign: TextAlign.center,
                ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }
}

class RegisterPage extends StatefulWidget {
  
  const RegisterPage({
    super.key,
  });
  
  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _confirmController = TextEditingController();
  final TextEditingController _firstNameController = TextEditingController();
  final TextEditingController _lastNameController = TextEditingController();
  String _errorMessage = '';
  bool _isLoading = false;
  
  Future<void> _register() async {
    setState(() {
      _isLoading = true;
      _errorMessage = '';
    });

    if(_isValidPassword(passwordRegex)) {
      if(_isConfirmMatch()) {
        try {
          final response = await http.post(
            Uri.parse('${dotenv.env['VITE_API_URL']}/register'),  //API LOGIN CALL HERE
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({
              'firstName': _firstNameController.text,
              'lastName': _lastNameController.text,
              'email': _emailController.text,
              'password': _passwordController.text,
            }),
          );

          if (response.statusCode == 201) {
            final data = jsonDecode(response.body);
            
            if (data['error'] == null || data['error'].isEmpty) {
              // Register successful, navigate to login page
              _errorMessage = 'Registration Successful. Check email for Confirmation.';
            } else {
              setState(() {
                _errorMessage = 'Error Registering this account';
              });
            }
          } else {
            setState(() {
              _errorMessage = 'Register failed. Please try again.';
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
      }
      else {
        setState(() {
          _errorMessage = 'Passwords must match.';
          _isLoading = false;
        });
      }
    }
    else {
      setState(() {
        _errorMessage = 'Password must be at least 8 characters and include a special character and a number.';
        _isLoading = false;
      });
    }
  }

  bool _isValidPassword(RegExp passwordRegex) {
    return passwordRegex.hasMatch(_passwordController.text);
  }

  bool _isConfirmMatch() {
    return _confirmController.text == _passwordController.text;
  }

  void _redirectLogin() {
    if (mounted) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (context) => LoginPage(),
        ),
      );
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
              const Text(
                'Register New User',
                style: TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 40),
              TextField(
                controller: _firstNameController,
                decoration: const InputDecoration(
                  labelText: 'First Name',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _lastNameController,
                decoration: const InputDecoration(
                  labelText: 'Last Name',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _emailController,
                decoration: const InputDecoration(
                  labelText: 'Email',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _passwordController,
                obscureText: true,
                decoration: const InputDecoration(
                  labelText: 'Password',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _confirmController,
                obscureText: true,
                decoration: const InputDecoration(
                  labelText: 'Confirm Password',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: _isLoading ? null : _register,
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
                child: _isLoading
                    ? const CircularProgressIndicator()
                    : const Text(
                        'Finish Registration',
                        style: TextStyle(fontSize: 16),
                      ),
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: _redirectLogin,
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
                child: _isLoading
                    ? const CircularProgressIndicator()
                    : const Text(
                        'Return to Login',
                        style: TextStyle(fontSize: 16),
                      ),
              ),
              const SizedBox(height: 16),
              if (_errorMessage.isNotEmpty)
                Text(
                  _errorMessage,
                  style: const TextStyle(
                    color: Colors.red,
                    fontSize: 14,
                  ),
                  textAlign: TextAlign.center,
                ),
            ],
          ),
        ),
      ),
    );
  }
}

class CalendarPage extends StatefulWidget {

  const CalendarPage({
    super.key,
  });

  @override
  State<CalendarPage> createState() => _CalendarPageState();
}

class _CalendarPageState extends State<CalendarPage> {
  
  DateTime _focusedDay = DateTime.now();
  DateTime? _selectedDay;
  Map<DateTime, List<Event>> events = {};
  Map<DateTime, String> emotionOnDay = {};
  TextEditingController _eventNameController = TextEditingController();
  TextEditingController _eventContentController = TextEditingController();

  //EventLoader for repeating events

  @override
  void initState() {
    super.initState();
    _selectedDay = _focusedDay;
    //Get events list from db
  }

  @override
  void dispose() {
    super.dispose();
  }

  List<Event> _getEventsForDay(DateTime day) {
    return events[day] ?? [];
  }

  void _onDaySelected(DateTime selectedDay, DateTime focusedDay) {
      if(!isSameDay(_selectedDay, selectedDay)) {
        setState(() {
          _selectedDay = selectedDay;
          _focusedDay = _focusedDay;
          //_selectedEvents = _getEventsForDay(selectedDay);
        });
      }
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Calendar")),
      floatingActionButton: FloatingActionButton(
        onPressed: () { 
          showDialog(
            context: context,
            builder: (context) {
              return AlertDialog(
                scrollable: true,
                title: Text("Add Event for " + _selectedDay.toString()),
                content: Padding(
                  padding: EdgeInsets.all(8),
                  child: Column(
                    children: [
                      TextField(
                        controller: _eventNameController,
                        decoration: InputDecoration(
                          hintText: 'Event Name',
                        ),
                      ),
                      TextField(
                        controller: _eventContentController,
                        decoration: InputDecoration(
                          hintText: 'Event Description',
                        ),
                      )
                    ],
                  ),
                ),
                actions: [
                  ElevatedButton(
                    onPressed: () {
                      //Push event to db
                      events.addAll({
                        _selectedDay!: [Event(_eventNameController.text, "", DateTime.now(), DateTime.now())]
                      });
                      Navigator.of(context).pop();
                    }, 
                    child: Text("Submit Event"),
                  )
                ],
              );
            },
          );
        },
        child: Icon(Icons.add),),
      body: content(),
    );
  }

  Widget content() {
    return Padding(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        children: [
          TableCalendar(
            rowHeight: 50,
            headerStyle: HeaderStyle(
              formatButtonVisible: false,
              titleCentered: true,),
            focusedDay: _focusedDay, 
            firstDay: DateTime.utc(DateTime.now().year - 8, 01, 01), 
            lastDay: DateTime.utc(DateTime.now().year + 8, 12, 12),
            calendarFormat: CalendarFormat.month,
            startingDayOfWeek: StartingDayOfWeek.sunday,
            onDaySelected: _onDaySelected,
            selectedDayPredicate: (day)=>isSameDay(_selectedDay, day),
            calendarStyle: CalendarStyle(
              outsideDaysVisible: false,
            ),
            onPageChanged: (focusedDay) {
              _focusedDay = focusedDay;
            },
          ),
          SizedBox(height: 8)
        ],
      )
    );
  }
  
}
  