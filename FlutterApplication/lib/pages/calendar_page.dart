import 'dart:collection';

import 'package:flutter/material.dart';
import 'package:flutter_application_1/models/emotion.dart';
import 'package:flutter_application_1/services/emotion_service.dart';
import 'package:intl/intl.dart';
import 'package:logger/logger.dart';
import 'package:table_calendar/table_calendar.dart';
import '../models/event.dart';
import '../services/event_service.dart';
import 'login_page.dart';

var logger = Logger(output: null);

late final String userIdent;

typedef EmotionEntry = DropdownMenuEntry<EmotionTypes>;

enum EmotionTypes {
  neutral('Neutral', Colors.white),
  happy('Happy', Colors.amber),
  sad('Sad', Colors.blue),
  angry('Angry', Colors.red);

  const EmotionTypes(this.label, this.color);
  final String label;
  final Color color;

  static final List<EmotionEntry> emotionTypeEntries = UnmodifiableListView<EmotionEntry>(
    values.map<EmotionEntry>(
      (EmotionTypes emotionType) => EmotionEntry(
        value: emotionType,
        label: emotionType.label,
      ),
    )
  );
}

class CalendarPage extends StatefulWidget {
  final String token;
  final String uid;
  const CalendarPage({super.key, required this.token, required this.uid});

  setUID() {
    userIdent = uid;
  }

  @override
  State<CalendarPage> createState() => _CalendarPageState();
}

class _CalendarPageState extends State<CalendarPage> {
  late final EventService _eventService;
  late final EmotionService _emotionService;
  DateTime _focusedDay = DateTime.now();
  DateTime? _selectedDay;
  Map<DateTime, List<Event>> events = {};
  late final ValueNotifier<List<Event>> _selectedEvents;
  Map<DateTime, Emotion?> emotions = {};
  late final ValueNotifier<Emotion> _selectedEmotion;
  final TextEditingController _emotionTypeController = TextEditingController();
  final TextEditingController _emotionContentController = TextEditingController();
  final TextEditingController _eventNameController = TextEditingController();
  final TextEditingController _eventContentController = TextEditingController();
  DateTime? _startDateTime;
  DateTime? _endDateTime;
  DateTime? _recurringEnd;
  final Map<String, bool> _recurringDays = {
    'Sun': false, 'Mon': false, 'Tue': false, 'Wed': false,
    'Thu': false, 'Fri': false, 'Sat': false,
  };


  @override
  void initState() {
    super.initState();
    _selectedDay = _focusedDay;
    _eventService = EventService(widget.token);
    _emotionService = EmotionService(widget.token);
    _selectedEvents = ValueNotifier(_getEventsForDay(_selectedDay!));
    _selectedEmotion = ValueNotifier(_getEmotionForDay(_selectedDay!)!);
    _fetchEvents();
    _fetchEmotions();
  }

  @override
  void dispose() {
    _selectedEvents.dispose();
    super.dispose();
  }

  List<Event> _getEventsForDay(DateTime day) {
    final dateKey = DateTime.utc(day.year, day.month, day.day);
    List<Event> dailyEvents = events[dateKey] ?? [];

    for(var entry in events.entries) {
      for(var event in entry.value) {
        if(event.recurring && event.recurDays != null && event.recurDays!.contains(day.weekday%7) && day.isAfter(event.startTime.subtract(const Duration(days: 1))) && (event.recurEnd == null || day.isBefore(event.recurEnd!.add(const Duration(days: 1))))) {
          if(!dailyEvents.contains(event)) {
            dailyEvents.add(event);
          }
        }
      }
    }
    return dailyEvents;
  }

  Emotion? _getEmotionForDay(DateTime day) {
    final dateKey = DateTime.utc(day.year, day.month, day.day);

    return emotions[dateKey];
  }

  void _onDaySelected(DateTime selectedDay, DateTime focusedDay) {
    if (!isSameDay(_selectedDay, selectedDay)) {
      setState(() {
        _selectedDay = selectedDay;
        _focusedDay = focusedDay;
      });
    }
    _selectedEvents.value = _getEventsForDay(selectedDay);
    _selectedEmotion.value = _getEmotionForDay(selectedDay)!;
  }

  Future<void> _fetchEvents() async {
    try {
      final start = DateTime.now().subtract(Duration(days: 30));
      final end = DateTime.now().add(Duration(days: 30));
      final fetched = await _eventService.fetchEvents(start, end);
      setState(() {
        events.clear();
        for (var event in fetched) {
          final key = DateTime.utc(event.startTime.year, event.startTime.month, event.startTime.day);
          events.putIfAbsent(key, () => []);

          if(!events[key]!.any((e) => e.id == event.id)) {
            events[key]!.add(event);
          }
        }
        _selectedEvents.value = _getEventsForDay(_selectedDay!);
      });
    } catch (e) {
      logger.e("Error fetching events: $e");
    }
  }

  Future<void> _fetchEmotions() async {
    try {
      final day = _selectedDay;
      final fetched = await _emotionService.fetchEmotions(day!);
      setState(() {
        emotions.clear();
        for(var emotion in fetched) {
          final key = DateTime.utc(emotion.createdAt.year, emotion.createdAt.month, emotion.createdAt.day);
          emotions.putIfAbsent(key, () => Emotion(emotion: 'Neutral', createdAt: day));

          if(emotions[key]!.id != emotion.id) {
            emotions[key] = emotion;
          }
        }
        _selectedEmotion.value = _getEmotionForDay(_selectedDay!)!;
      });
    } catch (e) {
      logger.e("Error fetching emotions: $e");
    }
  }

  void _submitEvent({String? id}) async {
    if(_startDateTime == null || _endDateTime == null) return;

    final recurDays = _recurringDays.entries
        .where((e) => e.value)
        .map((e) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(e.key))
        .toList();

    final event = Event(
      id: id,
      title: _eventNameController.text,
      content: _eventContentController.text,
      startTime: _startDateTime!,
      endTime: _endDateTime!,
      recurring: recurDays.isNotEmpty,
      recurDays: recurDays,
      recurEnd: _recurringEnd,
    );

    final success = id == null ? await _eventService.createEvent(event) : await _eventService.updateEvent(event);

    if(success) {
      await _fetchEvents();
      _clearEventForm();
      if(mounted) {
        Navigator.of(context).pop();
      }
    } else {
      if(mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(id == null ? 'Failed to create event.' : 'Failed to update event.')),
        );
      }
    }
  }

  void _submitEmotion({String? id}) async {
    final emotion = Emotion(
      id: id,
      emotion: _emotionContentController.text, 
      content: _emotionContentController.text,
      createdAt: _selectedDay ?? _focusedDay,
      uID: userIdent,
    );

    final success = id == null ? await _emotionService.createEmotion(emotion) : await _emotionService.updateEmotion(emotion);

    if(success) {
      await _fetchEmotions();
      _clearEmotionForm();
      if(mounted) {
        Navigator.of(context).pop();
      }
      else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(id == null ? 'Failed to create emotion.' : 'Failed to update emotion.')),
          );
        }
      }
    }
  }

  void _clearEventForm() {
    _eventNameController.clear();
    _eventContentController.clear();
    _startDateTime = null;
    _endDateTime = null;
    _recurringEnd = null;
    _recurringDays.updateAll((key, _) => false);
  }

  void _clearEmotionForm() {
    _emotionContentController.clear();
    _emotionTypeController.clear();
  }

  void _deleteEvent(Event event) async {
    if(event.id == null) return;
    try {
      bool success = await _eventService.deleteEvent(event.id!);
      if(success) {
        await _fetchEvents();
        setState(() {
          _selectedEvents.value = _getEventsForDay(_selectedDay!);
        });
      } else {
        if(mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Failed to delete event.')),
          );
        }
      }
    } catch (e) {
      logger.e("Delete error: $e");
      if(mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to delete event.')),
        );
      }
    }
  }

  void _deleteEmotion(Emotion emotion) async {
    if(emotion.id == null) return;
    try {
      bool success = await _emotionService.deleteEmotion(emotion.id!);
      if(success) {
        await _fetchEmotions();
        setState(() {
          _selectedEmotion.value = _getEmotionForDay(_selectedDay!)!;
        });
      }
      else {
        if(mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Failed to delete emotion.')),
          );
        }
      }
    } catch (e) {
      logger.e("Delete error: $e");
      if(mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to delete emotion.')),
        );
      }
    }
  }

  void _showEmotionDialog({Emotion? emotion}) {
    if(emotion != null) {
      _emotionTypeController.text = emotion.emotion;
      _emotionContentController.text = emotion.content!;
    }

    showDialog(
      context: context, 
      builder: (context) => StatefulBuilder(
        builder: (context, setState) => AlertDialog(
          scrollable: true,
          title: Text(emotion == null ? "Add Daily Emotion" : "Edit Daily Emotion"),
          content: Padding(
            padding: const EdgeInsets.all(8),
            child: Column(
              children: [
                DropdownMenu<EmotionTypes>(
                  initialSelection: EmotionTypes.neutral,
                  controller: _emotionTypeController,
                  label: const Text('Emotion'),
                  dropdownMenuEntries: EmotionTypes.emotionTypeEntries,
                ),
              ],
            ),
          ),
          actions: [
            ElevatedButton(
              onPressed: () => _submitEmotion(id: emotion?.id), 
              child: Text(emotion == null ? "Submit" : "Save Changes")
            )
          ],
        )
      )
    );
  }

  void _showEventDialog({Event? event}) {
    if(event != null) {
      _eventNameController.text = event.title;
      _eventContentController.text = event.content;
      _startDateTime = event.startTime;
      _endDateTime = event.endTime;
      _recurringEnd = event.recurEnd;
      _recurringDays.updateAll((key, _) => false);
      if(event.recurDays != null) {
        for(var index in event.recurDays!) {
          _recurringDays[['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index]] = true;
        }
      }
    }

    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setState) => AlertDialog(
          scrollable: true,
          title: Text(event == null ? "Add Event" : "Edit Event"),
          content: Padding(
            padding: const EdgeInsets.all(8),
            child: Column(
              children: [
                TextField(controller: _eventNameController, decoration: const InputDecoration(hintText: 'Event Name')),
                TextField(controller: _eventContentController, decoration: const InputDecoration(hintText: 'Event Description')),
                const SizedBox(height: 12),
                ListTile(
                  title: Text(_startDateTime != null ? 'Start: ${_startDateTime!.toLocal()}' : 'Pick Start Date & Time'),
                  onTap: () async {
                    final date = await showDatePicker(
                      context: context,
                      initialDate: _startDateTime ?? DateTime.now(),
                      firstDate: DateTime(2020),
                      lastDate: DateTime(2100),
                    );
                    if(date != null) {
                      final time = await showTimePicker(
                        // ignore: use_build_context_synchronously
                        context: context,
                        initialTime: _startDateTime != null ? TimeOfDay.fromDateTime(_startDateTime!) : TimeOfDay.now(),
                      );
                      if(time != null){
                        setState(() => _startDateTime = DateTime(date.year, date.month, date.day, time.hour, time.minute));
                      }
                    }
                  },
                ),
                ListTile(
                  title: Text(_endDateTime != null ? 'End: ${_endDateTime!.toLocal()}' : 'Pick End Date & Time'),
                  onTap: () async {
                    final date = await showDatePicker(
                      context: context,
                      initialDate: _endDateTime ?? DateTime.now(),
                      firstDate: DateTime(2020),
                      lastDate: DateTime(2100),
                    );
                    if(date != null) {
                      final time = await showTimePicker(
                        // ignore: use_build_context_synchronously
                        context: context,
                        initialTime: _endDateTime != null ? TimeOfDay.fromDateTime(_endDateTime!) : TimeOfDay.now(),
                      );
                      if(time != null) {
                        setState(() => _endDateTime = DateTime(date.year, date.month, date.day, time.hour, time.minute));
                      }
                    }
                  },
                ),
                Wrap(
                  spacing: 6,
                  children: _recurringDays.keys.map((day) {
                    return FilterChip(
                      label: Text(day),
                      selected: _recurringDays[day]!,
                      onSelected: (val) => setState(() => _recurringDays[day] = val),
                    );
                  }).toList(),
                ),
                ListTile(
                  title: Text(_recurringEnd != null ? 'Recurrence Ends: ${_recurringEnd!.toLocal()}' : 'Pick Recurrence End Date'),
                  onTap: () async {
                    final date = await showDatePicker(
                      context: context,
                      initialDate: _recurringEnd ?? DateTime.now().add(const Duration(days: 7)),
                      firstDate: DateTime.now(),
                      lastDate: DateTime(2100),
                    );
                    if(date != null) {
                      setState(() => _recurringEnd = date);
                    }
                  },
                ),
              ],
            ),
          ),
          actions: [
            ElevatedButton(
              onPressed: () => _submitEvent(id: event?.id),
              child: Text(event == null ? "Submit" : "Save Changes"),
            )
          ],
        ),
      ),
    );
  }

  _emotionEdit() {
    if(mounted) {
      
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("OnPAR"),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () => Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const LoginPage())),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showEventDialog(),
        child: const Icon(Icons.add),
      ),
      body: _buildContent(),
    );
  }

  Widget _buildContent() {
    return Padding(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        children: [
          TableCalendar<Event>(
            rowHeight: 50,
            headerStyle: const HeaderStyle(formatButtonVisible: false, titleCentered: true),
            focusedDay: _focusedDay,
            firstDay: DateTime.utc(DateTime.now().year - 8, 1, 1),
            lastDay: DateTime.utc(DateTime.now().year + 8, 12, 12),
            calendarFormat: CalendarFormat.month,
            startingDayOfWeek: StartingDayOfWeek.sunday,
            onDaySelected: _onDaySelected,
            eventLoader: _getEventsForDay,
            selectedDayPredicate: (day) => isSameDay(_selectedDay, day),
            calendarStyle: CalendarStyle(
              todayDecoration: BoxDecoration(
                color: Colors.amber[200],
                shape: BoxShape.circle,
              ),
              selectedDecoration: BoxDecoration(
                color: Colors.amber,
                shape: BoxShape.circle,
              ),
              markerDecoration: BoxDecoration(
                color: Colors.deepOrange,
                shape: BoxShape.circle,
              ),
              outsideDaysVisible: false,
            ),
            onPageChanged: (focusedDay) => _focusedDay = focusedDay,
          ),
          const SizedBox(height: 8),
          Card(
            margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
              child: ListTile(
                onTap: () => _emotionEdit(),
                
              ),
          ),
          const SizedBox(height: 8),
          Expanded(
            child: ValueListenableBuilder<Emotion>(
              valueListenable: _selectedEmotion, 
              builder: (context, value, _) => ListView.builder(
                itemCount: 1,
                itemBuilder: (context, index) {
                  final emotion = value;
                  return Card(
                    margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
                    child: ListTile(
                      title: Text('Emotion'),
                      subtitle: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(emotion.content ?? 'Neutral'),
                        ],
                      ),
                      trailing: Wrap(
                        spacing: 8,
                        children: [
                          IconButton(icon: const Icon(Icons.edit), onPressed: () => _showEmotionDialog(emotion: emotion)),
                          IconButton(icon: const Icon(Icons.delete), onPressed: () => _deleteEmotion(emotion)),                          
                        ],
                      ),
                    )
                  );
                }
                )
              )
            ),
          const SizedBox(height: 8),
          Expanded(
            child: ValueListenableBuilder<List<Event>>(
              valueListenable: _selectedEvents,
              builder: (context, value, _) => ListView.builder(
                  itemCount: value.length,
                  itemBuilder: (context, index) {
                    final event = value[index];
                    return Card(
                      margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
                      child: ListTile(
                        title: Text(event.title),
                        subtitle: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(event.content),
                            Text('From: ${DateFormat('hh:mm:ss').format(event.startTime.toLocal())}'),
                            Text('To: ${DateFormat('hh:mm:ss').format(event.endTime.toLocal())}'),
                            if (event.recurring)
                              Text('Repeats on: ${event.recurDays?.map((d) => ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d]).join(', ')}'),
                            if (event.recurring && event.recurEnd != null)
                              Text('Ends on: ${event.recurEnd!.toLocal()}'),
                          ],
                        ),
                        trailing: Wrap(
                          spacing: 8,
                          children: [
                            IconButton(icon: const Icon(Icons.edit), onPressed: () => _showEventDialog(event: event)),
                            IconButton(icon: const Icon(Icons.delete), onPressed: () => _deleteEvent(event)),
                          ],
                        ),
                      ),
                    );
                  },
              ),
            ),
          )
        ],
      ),
    );
  }
}