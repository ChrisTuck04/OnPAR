class Emotion {
  final String? id;
  final String emotion;
  final String? content;
  final String? uID;

  Emotion({
    this.id,
    required this.emotion,
    this.content,
    this.uID,
  });

  factory Emotion.fromJson(Map<String, dynamic> json) {
    return Emotion(
      id: json['_id'],
      emotion: json['emotion'],
      content: json['content'],
      uID: json['userId'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'emotion': emotion,
      'content': content,
      'userId': uID,
    };
  }
}