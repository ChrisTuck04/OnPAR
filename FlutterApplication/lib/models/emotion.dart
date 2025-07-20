class Emotion {
  final String? id;
  final String emotion;
  final String? title;
  final String? leftContent;
  final String? rightContent;
  final String? uID;
  final DateTime createdAt;

  Emotion({
    required this.id,
    required this.emotion,
    this.title,
    this.leftContent,
    this.rightContent,
    required this.uID,
    required this.createdAt,
  });

  factory Emotion.fromJson(Map<String, dynamic> json) {
    final createdAtString = json['createdAt'] as String?;

    if (createdAtString == null || createdAtString.isEmpty) {
      throw FormatException(
        "The 'createdAt' field is missing, null, or empty in the JSON response.",
        json,
      );
    }

    return Emotion(
      id: json['_id'] as String?,
      emotion: json['emotion'] as String? ?? 'Neutral',
      title: json['title'] as String?,
      leftContent: json['leftContent'] as String?,
      rightContent: json['rightContent'] as String?,
      uID: json['userId'] as String?,
      createdAt: DateTime.parse(json['createdAt'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'emotion': emotion,
      'title': title,
      'leftContent': leftContent,
      'rightContent': rightContent,
      'userId': uID,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}