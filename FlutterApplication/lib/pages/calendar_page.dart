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
  TimeOfDay? _startTime;
  TimeOfDay? _endTime;
  Map<String, bool> _recurringDays = {
    'Sun': false, 'Mon': false, 'Tue': false, 'Wed': false,
    'Thu': false, 'Fri': false, 'Sat': false,
  };
  bool _applyToSelectedDay = true;

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

  List<Event> _getEventsForDay(DateTime day) {
    List<Event> dailyEvents = events[DateTime.utc(day.year, day.month, day.day)] ?? [];
    for (var entry in events.entries) {
      for (var event in entry.value) {
        if (event.recurring && event.recurDays != null && event.recurDays!.contains(day.weekday % 7)) {
          if (!dailyEvents.contains(event)) {
            dailyEvents.add(event);
          }
        }
      }
    }
    return dailyEvents;
  }

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
    final selectedDate = _applyToSelectedDay ? _selectedDay! : DateTime.now();
    final key = DateTime.utc(selectedDate.year, selectedDate.month, selectedDate.day);

    final startDateTime = DateTime(
      selectedDate.year, selectedDate.month, selectedDate.day,
      _startTime?.hour ?? 0, _startTime?.minute ?? 0,
    );
    final endDateTime = DateTime(
      selectedDate.year, selectedDate.month, selectedDate.day,
      _endTime?.hour ?? 1, _endTime?.minute ?? 0,
    );

    final recurDays = _recurringDays.entries
      .where((e) => e.value)
      .map((e) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(e.key))
      .toList();

    final event = Event(
      title: _eventNameController.text,
      content: _eventContentController.text,
      startTime: startDateTime,
      endTime: endDateTime,
      recurring: recurDays.isNotEmpty,
      recurDays: recurDays,
    );

    bool success = await _eventService.createEvent(event);
    if (success) {
      setState(() {
        events.putIfAbsent(key, () => []);
        events[key]!.add(event);

        _selectedEvents.value = _getEventsForDay(_selectedDay!);
      });

      _eventNameController.clear();
      _eventContentController.clear();
      _startTime = null;
      _endTime = null;
      _recurringDays.updateAll((key, value) => false);
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
      setState(() {
        for (var key in events.keys.toList()) {
          events[key]!.removeWhere((e) => e.id == event.id);
          if (events[key]!.isEmpty) {
            events.remove(key);
          }
        }
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
    _startTime = TimeOfDay.fromDateTime(event.startTime);
    _endTime = TimeOfDay.fromDateTime(event.endTime);
    _recurringDays.updateAll((key, _) => false);
    if (event.recurDays != null) {
      for (var dayIndex in event.recurDays!) {
        _recurringDays[['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][dayIndex]] = true;
      }
    }
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
              ListTile(
                title: Text(_startTime != null ? 'Start: ${_startTime!.format(context)}' : 'Pick Start Time'),
                onTap: () async {
                  final picked = await showTimePicker(context: context, initialTime: _startTime ?? TimeOfDay.now());
                  if (picked != null) setState(() => _startTime = picked);
                },
              ),
              ListTile(
                title: Text(_endTime != null ? 'End: ${_endTime!.format(context)}' : 'Pick End Time'),
                onTap: () async {
                  final picked = await showTimePicker(context: context, initialTime: _endTime ?? TimeOfDay.now());
                  if (picked != null) setState(() => _endTime = picked);
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
                startTime: DateTime(
                  event.startTime.year, event.startTime.month, event.startTime.day,
                  _startTime?.hour ?? 0, _startTime?.minute ?? 0,
                ),
                endTime: DateTime(
                  event.endTime.year, event.endTime.month, event.endTime.day,
                  _endTime?.hour ?? 1, _endTime?.minute ?? 0,
                ),
                recurring: _recurringDays.containsValue(true),
                recurDays: _recurringDays.entries.where((e) => e.value)
                    .map((e) => ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(e.key)).toList(),
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
          setState(() {
            _eventNameController.clear();
            _eventContentController.clear();
            _startTime = null;
            _endTime = null;
            _applyToSelectedDay = true;
            _recurringDays.updateAll((key, _) => false);
          });

          showDialog(
            context: context,
            builder: (context) {
              return StatefulBuilder(
                builder: (context, setDialogState) {
                  return AlertDialog(
                    scrollable: true,
                    title: const Text("Add Event"),
                    content: Padding(
                      padding: const EdgeInsets.all(8),
                      child: Column(
                        children: [
                          TextField(
                            controller: _eventNameController,
                            decoration: const InputDecoration(hintText: 'Event Name'),
                          ),
                          TextField(
                            controller: _eventContentController,
                            decoration: const InputDecoration(hintText: 'Event Description'),
                          ),
                          const SizedBox(height: 12),
                          ListTile(
                            title: Text(_startTime != null
                                ? 'Start: ${_startTime!.format(context)}'
                                : 'Pick Start Time'),
                            onTap: () async {
                              final picked = await showTimePicker(
                                context: context,
                                initialTime: TimeOfDay.now(),
                              );
                              if (picked != null) {
                                setState(() => _startTime = picked);
                                setDialogState(() {});
                              }
                            },
                          ),
                          ListTile(
                            title: Text(_endTime != null
                                ? 'End: ${_endTime!.format(context)}'
                                : 'Pick End Time'),
                            onTap: () async {
                              final picked = await showTimePicker(
                                context: context,
                                initialTime: TimeOfDay.now(),
                              );
                              if (picked != null) {
                                setState(() => _endTime = picked);
                                setDialogState(() {});
                              }
                            },
                          ),
                          Wrap(
                            spacing: 6,
                            children: _recurringDays.keys.map((day) {
                              return FilterChip(
                                label: Text(day),
                                selected: _recurringDays[day]!,
                                onSelected: (val) {
                                  setState(() => _recurringDays[day] = val);
                                  setDialogState(() {});
                                },
                              );
                            }).toList(),
                          ),
                          SwitchListTile(
                            title: const Text("Apply to Selected Day"),
                            value: _applyToSelectedDay,
                            onChanged: (value) {
                              setState(() => _applyToSelectedDay = value);
                              setDialogState(() {});
                            },
                          ),
                        ],
                      ),
                    ),
                    actions: [
                      ElevatedButton(
                        onPressed: _submitEvent,
                        child: const Text("Submit"),
                      ),
                    ],
                  );
                },
              );
            },
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
                        subtitle: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(event.content),
                            Text('From: ${event.startTime}'),
                            Text('To: ${event.endTime}'),
                            if (event.recurring)
                              Text('Repeats on: ${event.recurDays?.map((d) => ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d]).join(', ')}'),
                          ],
                        ),
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