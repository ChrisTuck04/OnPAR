import 'dart:convert';
import 'package:flutter_application_1/models/emotion.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:logger/logger.dart';
import 'package:http/http.dart' as http;

var logger = Logger(output: null);

class EmotionService {
    final String emotionURL = dotenv.env['VITE_API_EMOTIONS_URL'] ?? '';
    final String token;

    EmotionService(this.token);

    Map<String, String> get _headers => {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer $token',
    };

    Future<bool> createEmotion(Emotion emotion) async {
        final response = await http.post(
        Uri.parse('$emotionURL/create-emotion'),
        headers: _headers,
        body: jsonEncode(emotion.toJson()),
        );

        logger.i('CreateEmotion status: ${response.statusCode}');
        logger.i('CreateEmotion response: ${response.body}');

        return response.statusCode == 201;
    }

    Future<List<Emotion>> fetchEmotions(DateTime day) async {
        final DateTime startDate = DateTime(day.year, day.month, day.day);
        final DateTime endDate = DateTime(day.year, day.month, day.day, 23, 59, 59);

        final response = await http.post(
            Uri.parse('$emotionURL/read-emotions'),
            headers: _headers,
            body: jsonEncode({
                'startDate': startDate.toIso8601String(),
                'endDate': endDate.toIso8601String(),
            }),
        );

        if (response.statusCode == 200) {
            print("--- RAW JSON RESPONSE FROM SERVER ---");
            print(response.body);
            final data = jsonDecode(response.body);
            if (data['emotions'] != null && data['emotions'] is List) {
                final List<Emotion> emotions = (data['emotions'] as List)
                    .map((e) => Emotion.fromJson(e))
                    .toList();
                return emotions;
            }
            return [];
        } else {
            logger.e('Failed to fetch Emotions: ${response.statusCode} ${response.body}');
            throw Exception('Failed to fetch Emotions');
        }
    }

    Future<bool> deleteEmotion(String emotionId) async {
        final response = await http.post(
            Uri.parse('$emotionURL/delete-emotion'),
            headers: _headers,
            body: jsonEncode({'emotionId': emotionId}),
        );

        return response.statusCode == 200;
    }

    Future<bool> updateEmotion(Emotion emotion) async {
        final Map<String, dynamic> body = emotion.toJson();
        body['emotionId'] = emotion.id;

        final response = await http.post(
            Uri.parse('$emotionURL/update-emotion'),
            headers: _headers,
            body: jsonEncode(body),
        );

        return response.statusCode == 200;
    }
}