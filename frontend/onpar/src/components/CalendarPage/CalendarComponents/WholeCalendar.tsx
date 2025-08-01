import { useState, useEffect } from 'react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  getDaysInMonth,
  getDay,
  isToday,
  getDate,
  addDays,
  isBefore,
  isSameDay,
} from 'date-fns';

// @ts-expect-error axios functions in js
import {readEmotions} from "../../../api/emotions"
import type { Emotions } from "../../../types/Emotions" 

interface Event {
  _id: string;
  title: string;
  content: string;
  startTime: string; 
  endTime: string;
  recurring: boolean;
  userId: string; 
  sharedEmails: string[];
  color: number; 
  recurDays: number[];
  recurEnd: string; 
}

// Extended interface for calendar display events (includes recurring instances)
interface CalendarEvent extends Event {
  displayDate?: Date; // The actual date this instance should be displayed
  isRecurringInstance?: boolean; // Whether this is a recurring instance
}

// @ts-expect-error readEvents, updateEvents, deleteEvents are from a JS file
import { readEvents, deleteEvents } from "../../../api/events";
import { AxiosError } from 'axios';
import { EditEventModal } from '../../EventsComponents/EditEventModal';

interface WholeCalendarProps {
  eventVersion : number
  version: number
}

const WholeCalendar = ({eventVersion} : WholeCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [version, setVersion] = useState(eventVersion);

  const handleEditClick = (event: Event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleSave = () => {
    setVersion(prev => prev + 1);
  };

  const handleClose = () => {
    setShowModal(false);
  }

  const goToPreviousMonth = () => {
    setCurrentDate((prevDate) => subMonths(prevDate, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate((prevDate) => addMonths(prevDate, 1));
  };

  return (
    <div className="flex flex-col h-full w-full bg-onparLightYellow border-onparOrange border-[5px] rounded-[40px] overflow-hidden">
      <CalendarHeading
        currentDate={currentDate}
        goToPreviousMonth={goToPreviousMonth}
        goToNextMonth={goToNextMonth}
      />
      
      <CalendarGrid currentDate={currentDate} version={version} eventVersion={eventVersion} onEditEvent={handleEditClick} onSave={handleSave} onClose={handleClose}/>
      
      {showModal && selectedEvent && (
        <EditEventModal
          event={selectedEvent}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

interface CalendarHeadingProps {
  currentDate: Date;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
}

const CalendarHeading = ({
  currentDate,
  goToPreviousMonth,
  goToNextMonth,
}: CalendarHeadingProps) => {
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="w-full">
      <div
        className="relative grid grid-cols-3 text-center font-fredoka text-black top-[8px]"
        style={{ WebkitTextStroke: '1px #FFAA00' }}
      >
        <button className="text-[25px] py-2" onClick={goToPreviousMonth}>
          {'<<'}
        </button>

        <div className="text-[35px]">{format(currentDate, 'MMMM yyyy')}</div>

        <button className="text-[25px] py-2" onClick={goToNextMonth}>
          {'>>'}
        </button>
      </div>

      <div>
        <hr className="absolute w-full border-t-[4px] border-onparOrange top-[62px]" />
        <hr className="absolute w-full border-t-[4px] border-onparOrange top-[119px]" />
      </div>

      <div
        className="relative grid grid-cols-7 text-center font-fredoka text-lg text-black top-[6px] "
        style={{ WebkitTextStroke: '1px #FFAA00' }}
      >
        {daysOfWeek.map((day, index) => (
          <div
            key={index}
            className="border-[2px] border-onparOrange py-2 px-[40px] h-[60px]"
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

interface CalendarGridProps {
  currentDate: Date;
  eventVersion : number
  version: number
  onEditEvent: (event: Event) => void;
  onSave: () => void;
  onClose: () => void;
}

const CalendarGrid = ({ currentDate, version, eventVersion, onEditEvent, onSave, onClose }: CalendarGridProps) => {

  const [events, setEvents] = useState<Event[]>([]);
  const [emotions, setEmotions] = useState<Emotions[]>([]) 

  const days = [];
  const monthStart = startOfMonth(currentDate);
  const numDaysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonthWeekday = getDay(monthStart);

  const numLeadingEmptyCells = firstDayOfMonthWeekday;
  const numTrailingEmptyCells = 42 - (numLeadingEmptyCells + numDaysInMonth);

  const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

  // Function to generate recurring event instances
  const generateRecurringEvents = (events: Event[]): CalendarEvent[] => {
    const allEvents: CalendarEvent[] = [];

    events.forEach(event => {
      // Add the original event
      allEvents.push({
        ...event,
        displayDate: new Date(event.startTime),
        isRecurringInstance: false
      });

      // Debug logging
      console.log('Processing event:', event.title, {
        recurring: event.recurring,
        recurDays: event.recurDays,
        recurEnd: event.recurEnd,
        hasRecurDays: event.recurDays && event.recurDays.length > 0
      });

      // Generate recurring instances if the event is recurring
      if (event.recurring && event.recurDays && event.recurDays.length > 0 && event.recurEnd) {
        console.log('Event is recurring, generating instances...');
        const startDate = new Date(event.startTime);
        const endDate = new Date(event.recurEnd);
        
        console.log('Dates:', {
          startDate: startDate,
          endDate: endDate,
          recurEnd: event.recurEnd,
          isValidEndDate: !isNaN(endDate.getTime()),
          isValidStartDate: !isNaN(startDate.getTime())
        });
        
        // Validate dates
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          console.error('Invalid dates for recurring event:', event.title);
          return;
        }
        
        // Start from the day after the original event
        let currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + 1);

        let instanceCount = 0;
        let loopCount = 0;
        const maxLoops = 365; // Safety net to prevent infinite loops
        
        // Generate instances until we reach or exceed the end date
        while ((isBefore(currentDate, endDate) || isSameDay(currentDate, endDate)) && loopCount < maxLoops) {
          const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
          
          console.log(`Checking date: ${format(currentDate, 'yyyy-MM-dd')} (day of week: ${dayOfWeek}), recurDays includes: ${event.recurDays.includes(dayOfWeek)}`);
          
          // Check if this day of week is in the recurDays array
          if (event.recurDays.includes(dayOfWeek)) {
            instanceCount++;
            console.log(`Creating recurring instance ${instanceCount} for ${format(currentDate, 'yyyy-MM-dd')} (day ${dayOfWeek})`);
            
            // Calculate the time difference for this recurring instance
            const originalTime = new Date(event.startTime);
            const recurringStartTime = new Date(currentDate);
            recurringStartTime.setHours(originalTime.getHours());
            recurringStartTime.setMinutes(originalTime.getMinutes());
            recurringStartTime.setSeconds(originalTime.getSeconds());
            
            const originalEndTime = new Date(event.endTime);
            const recurringEndTime = new Date(currentDate);
            recurringEndTime.setHours(originalEndTime.getHours());
            recurringEndTime.setMinutes(originalEndTime.getMinutes());
            recurringEndTime.setSeconds(originalEndTime.getSeconds());

            allEvents.push({
              ...event,
              startTime: recurringStartTime.toISOString(),
              endTime: recurringEndTime.toISOString(),
              displayDate: new Date(currentDate),
              isRecurringInstance: true
            });
          }
          
          // Move to next day
          currentDate.setDate(currentDate.getDate() + 1);
          loopCount++;
        }
        
        console.log(`Generated ${instanceCount} recurring instances for event: ${event.title} (looped ${loopCount} times)`);
      }
    });

    return allEvents;
  };

  // Function to retrieve array of events
  const retrieveEvents = async () => {
    try {
      const response = await readEvents("2015-07-20T00:00:00Z", "2035-07-20T00:00:00Z");
      const retrievedEvents = response.events
      
      if (Array.isArray(retrievedEvents)) {
        setEvents(retrievedEvents);
      } else {
        console.error("readEvents did not return an array in the 'events' property:", retrievedEvents);
        setEvents([])
      }

    } catch (err : unknown) {
      const error = err as AxiosError<{ error: string}>;
      console.error("Error retrieving events:", error.response?.data?.error || "Unknown error");
      setEvents([]);
    }
  };

  // useEffect to re-run events retrieval function when eventVersion changes
  useEffect(() => {
    retrieveEvents();
  }, [version, eventVersion, currentDate]); // Added currentDate to dependency array to re-fetch on month change

  // Function to retrieve array of emotions
  const retrieveEmotions = async () => {
    try {
      const response = await readEmotions("2015-07-20T00:00:00Z", "2035-07-20T00:00:00Z")
      const retrievedEmotions = response.emotions

      if(Array.isArray(retrievedEmotions)) { 
        setEmotions(retrievedEmotions)
      } else {
        console.error("readEmotions did not return an array in the 'emotions' property:", retrievedEmotions)
        setEmotions([])
      }

    } catch(err : unknown) {
      const error = err as AxiosError<{ error: string}>;
      console.error("Error retrieving emotions:", error.response?.data?.error || "Unknown error");
      setEmotions([]); // Corrected: setEmotions instead of setEvents
    }
  }

  useEffect(() => {
    retrieveEmotions()
  }, [currentDate]) // Re-fetch emotions when month changes

  for (let i = numLeadingEmptyCells; i > 0; i--) {
    const day = addDays(prevMonthLastDay, -i + 1);
    days.push({ date: day, isCurrentMonth: false, isToday: false });
  }

  for (let i = 1; i <= numDaysInMonth; i++) {
    const day = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
    days.push({ date: day, isCurrentMonth: true, isToday: isToday(day) });
  }

  for (let i = 1; i <= numTrailingEmptyCells; i++) {
    const day = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      i
    );
    days.push({ date: day, isCurrentMonth: false, isToday: false });
  }

  return (
    <div className="grid grid-cols-7 grid-rows-6 flex-grow justify-center text-center text-black text-fredoka rounded-b-[30px] overflow-hidden w-full h-full">
      {days.map((day, index) => {
        // Generate all recurring events first
        const allEvents = generateRecurringEvents(events);
        
        const eventsForDay = Array.isArray(allEvents) ? allEvents.filter(event => {
          const displayDate = event.displayDate || new Date(event.startTime);
          // Compare year, month, and date to ensure correct event filtering
          return (
            displayDate.getDate() === day.date.getDate() &&
            displayDate.getMonth() === day.date.getMonth() &&
            displayDate.getFullYear() === day.date.getFullYear()
          );
        }) : []; // If events is not an array, default to an empty array

        const emotionsForDay = Array.isArray(emotions) ? emotions.filter(emotion => {
         
          const emotionDate = new Date(emotion.createdAt); // Use 'createdAt' or 'date'
          return (
            emotionDate.getDate() === day.date.getDate() &&
            emotionDate.getMonth() === day.date.getMonth() &&
            emotionDate.getFullYear() === day.date.getFullYear()
          );
        }) : [];

        return <CalendarCell key={index} day={day} events={eventsForDay} emotions={emotionsForDay} onEditEvent={onEditEvent} onSave={onSave} onClose={onClose}/>;
      })}
    </div>
  );
};

interface CalendarCellProps {
  day: {
    date: Date;
    isCurrentMonth: boolean;
    isToday: boolean;
  };
  events: CalendarEvent[]; // Updated to use CalendarEvent type
  emotions: Emotions[]; // Add emotions prop to CalendarCell
  onEditEvent: (event: Event) => void;
  onSave: () => void;
  onClose: () => void;
}

const CalendarCell = ({ day, events, emotions, onEditEvent, onSave, onClose }: CalendarCellProps) => {
  return (
    <div
      key={day.date.toISOString()}
      className={`relative border-[2px] font-fredoka border-onparOrange flex flex-col items-start p-1 hover:bg-onparOrange overflow-hidden
      ${!day.isCurrentMonth ? 'text-transparent' : ''} 

      transition-all duration-300 ease-in-out
      hover:z-50
      hover:overflow-visible
      hover:w-[250px]
      hover:h-[300px]
      hover:shadow-lg
      hover:rounded-lg
      `}
      style={{ minHeight: '100px', width: 'auto' }}
    >
      {/* Day number */}
      <p
      className={`${day.isCurrentMonth ? 'absolute top-1 left-1/2 transform -translate-x-1/2 w-[30px] h-[30px] rounded-full bg-onparOrange flex items-center justify-center text-sm' : ''}`}
      style={day.isToday ? {animation: 'blink 1s infinite', backgroundColor: 'bg-onparOrange'} : {}}
      >
        {getDate(day.date)}
      </p>

      {/* CSS for the blinking animation */}
      <style>
        {`
          @keyframes blink {
            0%   { background-color: #FFAA00; }
            25%  { background-color: #FCD848; }
            50%  { background-color: #FDC930; }
            75%  { background-color: #FEB918; }
            100% { background-color: #FFAA00; }
          }
          .animate-blink {
            animation: blink 1s infinite;
          }
        `}
      </style>

      {/* Events container */}
      <div className="flex flex-col gap-0.5 w-full mt-8 z-0">
        {events.map((event, eventIndex) => (
          <DisplayedEvent 
            key={event.isRecurringInstance ? `${event._id}-recurring-${eventIndex}` : event._id} 
            event={event} 
            displayCurrentMonth={day.isCurrentMonth} 
            onEdit={() => onEditEvent(event)} 
            onSave={onSave} 
            onClose={onClose}
          />
        ))}
      </div>

      {/* Emotions container */}
      {/* Ensure emotions are only displayed if they belong to the current month */}
      <div className="flex flex-col gap-0.5 w-full mt-1 z-0"> {/* Added mt-1 for slight separation */}
        {emotions.map((emotion, emotionIndex) => (
          <DisplayedEmotion key={emotion.title + emotionIndex} emotion={emotion} displayCurrentMonth={day.isCurrentMonth} />
        ))}
      </div>

    </div>
  );
};

interface DisplayedEventProps {
  event: CalendarEvent; // Updated to use CalendarEvent type
  displayCurrentMonth : boolean
  onEdit: () => void;
  onSave: () => void;
  onClose: () => void;
}

const DisplayedEvent = ({ event, displayCurrentMonth, onEdit, onSave, onClose }: DisplayedEventProps) => {
  const [showOptions, setShowOptions] = useState(false);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleEdit = () => {
    setShowOptions(false);
    onEdit();
  };

  const handleDelete = async () => {
    await deleteEvents(event._id);
    setShowOptions(false);
    onSave();
    onClose();
  };

  const eventColors: { [key: number]: string } = {
    0: 'bg-[#CF1F1F]',
    1: 'bg-[#6BCB77]',
    2: 'bg-[#4D96FF]',
    3: 'bg-[#FFDB3D]',
    4: 'bg-[#C780FA]',
    5: 'bg-[#FF9F1C]',
    6: 'bg-[#00C2D1]',
    7: 'bg-[#500AA3]',
    8: 'bg-[#F15BB5]',
    9: 'bg-[#2B282A]'
  };

  const colorClass = eventColors[event.color] || 'bg-black'; // Default color if not mapped

  // Format start time to "hh:mm am/pm"
  const formattedStartTime = event.startTime ? format(new Date(event.startTime), 'hh:mm a') : '';
  const formattedEndTime = event.endTime ? format(new Date(event.endTime), 'hh:mm a') : '';

  return (
    <div
    onClick={toggleOptions}
    className={`${displayCurrentMonth ? "flex items-center gap-1 text-xs text-black text-[20px] p-0.5 rounded-md bg-opacity-80 w-full h-[50px] overflow-hidden whitespace-nowrap" : ''}`}>
      <div className={`${displayCurrentMonth ? `w-4 h-4 rounded-full flex-shrink-0 ${colorClass}` : ''}`}></div> {/* Color circle */}
      <p className="font-fredoka text-[15px] flex-shrink-0">{formattedStartTime}</p> {/* Hour and minute interval with AM/PM */}
      <p className="font-fredoka h-[17px] w-[10px] flex-shrink-0">to</p> {/* Hour and minute interval with AM/PM */}
      <p className="font-fredoka text-[15px] flex-shrink-0">{formattedEndTime}</p> {/* Hour and minute interval with AM/PM */}
      <p className="flex-shrink-0 text-[15px]">{event.title}</p> {/* Event title */}
      {event.isRecurringInstance && <span className="text-xs opacity-70">↻</span>} {/* Small indicator for recurring instances */}

      {showOptions && (
        <div className="absolute z-10 bg-white shadow-md rounded-md p-2 right-0">
          <button className="text-sm text-purple-600 pr-2" onClick={handleEdit}>Edit</button> 
          <button className="text-sm text-red-600" onClick={handleDelete}>Delete</button> 
        </div>
      )}
    </div>
  );
};

interface DisplayedEmotionProps {
  emotion: Emotions;
  displayCurrentMonth : boolean;
  // openJournalEntry: () => void; // Removed as per request
}

const DisplayedEmotion = ({emotion, displayCurrentMonth} : DisplayedEmotionProps) => { // Removed openJournalEntry from props

  const emotionIcons: {[key: string]: string} = {
    "Happy" : '/assets/HappyEmotion.png',
    "Sad": '/assets/SadEmotion.png',
    "Angry": '/assets/AngryEmotion.png',
    "Pleasant": '/assets/PleasantEmotion.png',
  } 

  const emotionIcon = emotionIcons[emotion.emotion] || '';

  return (
    displayCurrentMonth ? (
      <button
        className={`flex items-center gap-1 text-xs text-black p-0.5 rounded-md bg-opacity-80 w-full overflow-hidden whitespace-nowrap`}
        // onClick={openJournalEntry} // Removed onClick as per request
      >
        <img
          className="w-4 h-4 flex-shrink-0" 
          src={emotionIcon}
          alt={`Emotion icon for ${emotion.emotion}`}
          onError={(e) => { e.currentTarget.src = 'https://placehold.co/16x16/cccccc/000000?text=NA'; }} 
        />
        <p className="font-fredoka text-[15px] truncate">{emotion.title}</p> {/* Truncate long titles */}
      </button>
    ) : null // Render nothing if not current month
  )
}

export default WholeCalendar;