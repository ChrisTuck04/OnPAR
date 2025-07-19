class Emotion {
  final String? id;
  final String emotion;
  final String? content;
  final String? uID;
  final DateTime createdAt;

  Emotion({
    this.id,
    required this.emotion,
    this.content,
    this.uID,
    required this.createdAt,
  });

  factory Emotion.fromJson(Map<String, dynamic> json) {
    return Emotion(
      id: json['_id'],
      emotion: json['emotion'],
      content: json['content'],
      uID: json['userId'],
      createdAt: json['createdAt']
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'emotion': emotion,
      'content': content,
      'userId': uID,
      'createdAt': createdAt,
    };
  }
}