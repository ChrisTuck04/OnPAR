import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'package:logger/logger.dart';
import 'dart:convert';

import '../models/event.dart';

var logger = Logger(output: null);

class EventService {
  final String baseUrl = dotenv.env['VITE_API_URL'] ?? '';
  final String token;

  EventService(this.token);

  Map<String, String> get _headers => {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer $token',
  };

  Future<bool> createEvent(Event event) async {
    final response = await http.post(
      Uri.parse('$baseUrl/events/create-event'),
      headers: _headers,
      body: jsonEncode(event.toJson()),
    );

    logger.i('CreateEvent status: ${response.statusCode}');
    logger.i('CreateEvent response: ${response.body}');

    return response.statusCode == 201;
  }

  Future<List<Event>> fetchEvents(DateTime start, DateTime end) async {
    final response = await http.post(
      Uri.parse('$baseUrl/events/read-event'),
      headers: _headers,
      body: jsonEncode({
        'startDate': start.toIso8601String(),
        'endDate': end.toIso8601String(),
      }),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      final List<Event> events = (data['events'] as List)
          .map((e) => Event.fromJson(e))
          .toList();
      return events;
    } else {
      throw Exception('Failed to fetch events');
    }
  }

  Future<bool> deleteEvent(String eventId) async {
    final response = await http.post(
      Uri.parse('$baseUrl/events/delete-event'),
      headers: _headers,
      body: jsonEncode({'eventId': eventId}),
    );

    return response.statusCode == 200;
  }

  Future<bool> updateEvent(Event event) async {
    final response = await http.post(
      Uri.parse('$baseUrl/events/update-event'),
      headers: _headers,
      body: jsonEncode({
        'eventId': event.id,
        ...event.toJson(),
      }),
    );

    return response.statusCode == 200;
  }
}
