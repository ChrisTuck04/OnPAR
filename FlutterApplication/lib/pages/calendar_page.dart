import 'package:flutter/material.dart';
import 'package:table_calendar/table_calendar.dart';
import '../models/event.dart';
import '../services/event_service.dart';
import 'login_page.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class CalendarPage extends StatefulWidget {
  final String token;
  const CalendarPage({super.key, required this.token});

  @override
  State<CalendarPage> createState() => _CalendarPageState();
}

class _CalendarPageState extends State<CalendarPage> {
  late final EventService _eventService;
  DateTime _focusedDay = DateTime.now();
  DateTime? _selectedDay;
  Map<DateTime, List<Event>> events = {};
  late final ValueNotifier<List<Event>> _selectedEvents;
  final TextEditingController _eventNameController = TextEditingController();
  final TextEditingController _eventContentController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _selectedDay = _focusedDay;
    _eventService = EventService(widget.token);
    _selectedEvents = ValueNotifier(_getEventsForDay(_selectedDay!));
    _fetchEvents();
  }

  @override
  void dispose() {
    _selectedEvents.dispose();
    super.dispose();
  }

  List<Event> _getEventsForDay(DateTime day) => events[DateTime.utc(day.year, day.month, day.day)] ?? [];

  void _onDaySelected(DateTime selectedDay, DateTime focusedDay) {
    if (!isSameDay(_selectedDay, selectedDay)) {
      setState(() {
        _selectedDay = selectedDay;
        _focusedDay = focusedDay;
      });
    }
    _selectedEvents.value = _getEventsForDay(selectedDay);
  }

  Future<void> _fetchEvents() async {
    try {
      final start = DateTime.now().subtract(Duration(days: 30));
      final end = DateTime.now().add(Duration(days: 30));
      final fetched = await _eventService.fetchEvents(start, end);
      setState(() {
        for (var event in fetched) {
          final key = DateTime.utc(event.startTime.year, event.startTime.month, event.startTime.day);
          if (events[key] == null) events[key] = [];
          events[key]!.add(event);
        }
        _selectedEvents.value = _getEventsForDay(_selectedDay!);
      });
    } catch (e) {
      print("Error fetching events: $e");
    }
  }

  void _submitEvent() async {
    final event = Event(
      title: _eventNameController.text,
      content: _eventContentController.text,
      startTime: _selectedDay!,
      endTime: _selectedDay!.add(Duration(hours: 1)),
    );

    bool success = await _eventService.createEvent(event);
    if (success) {
      final key = DateTime.utc(_selectedDay!.year, _selectedDay!.month, _selectedDay!.day);
      setState(() {
        if (events[key] == null) events[key] = [];
        events[key]!.add(event);
        _selectedEvents.value = _getEventsForDay(_selectedDay!);
      });
      _eventNameController.clear();
      _eventContentController.clear();
      Navigator.of(context).pop();
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Failed to create event. Please try again.')),
      );
    }
  }

  void _deleteEvent(Event event) async {
    if (event.id == null) return;
    bool success = await _eventService.deleteEvent(event.id!);
    if (success) {
      final key = DateTime.utc(event.startTime.year, event.startTime.month, event.startTime.day);
      setState(() {
        events[key]!.remove(event);
        _selectedEvents.value = _getEventsForDay(_selectedDay!);
      });
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Failed to delete event.')),
      );
    }
  }

  void _editEvent(Event event) {
    _eventNameController.text = event.title;
    _eventContentController.text = event.content;
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        scrollable: true,
        title: const Text("Edit Event"),
        content: Padding(
          padding: const EdgeInsets.all(8),
          child: Column(
            children: [
              TextField(controller: _eventNameController, decoration: const InputDecoration(hintText: 'Event Name')),
              TextField(controller: _eventContentController, decoration: const InputDecoration(hintText: 'Event Description')),
            ],
          ),
        ),
        actions: [
          ElevatedButton(
            onPressed: () async {
              final updatedEvent = Event(
                id: event.id,
                title: _eventNameController.text,
                content: _eventContentController.text,
                startTime: event.startTime,
                endTime: event.endTime,
              );
              bool success = await _eventService.updateEvent(updatedEvent);
              if (success) {
                final key = DateTime.utc(event.startTime.year, event.startTime.month, event.startTime.day);
                setState(() {
                  int index = events[key]!.indexOf(event);
                  events[key]![index] = updatedEvent;
                  _selectedEvents.value = _getEventsForDay(_selectedDay!);
                });
                Navigator.of(context).pop();
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Failed to update event.')),
                );
              }
            },
            child: const Text("Save Changes"),
          )
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Calendar"),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            tooltip: 'Logout',
            onPressed: () {
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(builder: (context) => const LoginPage()),
              );
            },
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          showDialog(
            context: context,
            builder: (context) => AlertDialog(
              scrollable: true,
              title: const Text("Add Event"),
              content: Padding(
                padding: const EdgeInsets.all(8),
                child: Column(
                  children: [
                    TextField(controller: _eventNameController, decoration: const InputDecoration(hintText: 'Event Name')),
                    TextField(controller: _eventContentController, decoration: const InputDecoration(hintText: 'Event Description')),
                  ],
                ),
              ),
              actions: [
                ElevatedButton(
                  onPressed: _submitEvent,
                  child: const Text("Submit"),
                )
              ],
            ),
          );
        },
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
            calendarStyle: const CalendarStyle(outsideDaysVisible: false),
            onPageChanged: (focusedDay) => _focusedDay = focusedDay,
          ),
          const SizedBox(height: 8),
          Expanded(
            child: ValueListenableBuilder<List<Event>>(
              valueListenable: _selectedEvents,
              builder: (context, value, _) {
                return ListView.builder(
                  itemCount: value.length,
                  itemBuilder: (context, index) {
                    final event = value[index];
                    return Container(
                      margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
                      decoration: BoxDecoration(
                        border: Border.all(),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: ListTile(
                        title: Text(event.title),
                        subtitle: Text(event.content),
                        trailing: Wrap(
                          spacing: 8,
                          children: [
                            IconButton(
                              icon: const Icon(Icons.edit),
                              onPressed: () => _editEvent(event),
                            ),
                            IconButton(
                              icon: const Icon(Icons.delete),
                              onPressed: () => _deleteEvent(event),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}