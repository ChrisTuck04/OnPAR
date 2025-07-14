class Event {
  final String? id;
  final String title;
  final String content;
  final DateTime startTime;
  final DateTime endTime;
  final bool recurring;
  final int? color;
  final List<int>? recurDays;
  final DateTime? recurEnd;

  Event({
    this.id,
    required this.title,
    required this.content,
    required this.startTime,
    required this.endTime,
    this.recurring = false,
    this.color,
    this.recurDays,
    this.recurEnd,
  });

  factory Event.fromJson(Map<String, dynamic> json) {
    return Event(
      id: json['_id'],
      title: json['title'],
      content: json['content'],
      startTime: DateTime.parse(json['startTime']),
      endTime: DateTime.parse(json['endTime']),
      recurring: json['recurring'] ?? false,
      color: json['color'],
      recurDays: json['recurDays'] != null ? List<int>.from(json['recurDays']) : null,
      recurEnd: json['recurEnd'] != null ? DateTime.parse(json['recurEnd']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'title': title,
      'content': content,
      'startTime': startTime.toIso8601String(),
      'endTime': endTime.toIso8601String(),
      'recurring': recurring,
      if (color != null) 'color': color,
      if (recurDays != null) 'recurDays': recurDays,
      if (recurEnd != null) 'recurEnd': recurEnd?.toIso8601String(),
    };
  }
}
