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
} from 'date-fns';

// Define the Event interface based on your Events.js schema
interface Event {
  _id: string; // MongoDB ObjectId is a string in JS
  title: string;
  content: string;
  startTime: string; // Dates from API usually come as ISO strings
  endTime: string;
  recurring: boolean;
  userId: string; // MongoDB ObjectId is a string in JS
  sharedEmails: string[];
  color: number; // Assuming this number maps to a specific color
  recurDays: number[];
  recurEnd: string; // Date as ISO string
}

// @ts-expect-error readEvents, updateEvents, deleteEvents are from a JS file
import { readEvents, updateEvents, deleteEvents } from "../../../api/events";
import { AxiosError } from 'axios';

interface WholeCalendarProps {
  eventVersion : number
}

const WholeCalendar = ({eventVersion} : WholeCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

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
      
      <CalendarGrid currentDate={currentDate} eventVersion={eventVersion} />
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
}

const CalendarGrid = ({ currentDate, eventVersion }: CalendarGridProps) => {
  // useState for the array of retrieved events, initialized as an empty array
  const [events, setEvents] = useState<Event[]>([]);

  const days = [];
  const monthStart = startOfMonth(currentDate);
  const numDaysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonthWeekday = getDay(monthStart);

  const numLeadingEmptyCells = firstDayOfMonthWeekday;
  const numTrailingEmptyCells = 42 - (numLeadingEmptyCells + numDaysInMonth);

  const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

  // Function to retrieve array of events
  const retrieveEvents = async () => {
    try {
      const events = await readEvents("2015-07-20T00:00:00Z", "2035-07-20T00:00:00Z");
      // Ensure retrievedEvents is an array before setting state
      const retrievedEvents = events.events
      
      if (Array.isArray(retrievedEvents)) {
        setEvents(retrievedEvents);
      } else {
        console.error("readEvents did not return an array:", retrievedEvents);
        setEvents([]); // Reset events to an empty array to prevent errors
      }

    } catch (err : unknown) {
      const error = err as AxiosError<{ error: string}>;
      console.error("Error retrieving events:", error.response?.data?.error || "Unknown error");
      setEvents([]); // Ensure events is an empty array on error
      // You should replace alert with a custom message box for user feedback.
    }
  };

  // useEffect to re-run events retrieval function when eventVersion changes
  useEffect(() => {
    retrieveEvents();
  }, [eventVersion, currentDate]); // Added currentDate to dependency array to re-fetch on month change

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
        // Filter events that start on the current calendar cell's date
        // Ensure 'events' is an array before calling filter
        const eventsForDay = Array.isArray(events) ? events.filter(event => {
          const eventStartDate = new Date(event.startTime);
          // Compare year, month, and date to ensure correct event filtering
          return (
            eventStartDate.getDate() === day.date.getDate() &&
            eventStartDate.getMonth() === day.date.getMonth() &&
            eventStartDate.getFullYear() === day.date.getFullYear()
          );
        }) : []; // If events is not an array, default to an empty array
        return <CalendarCell key={index} day={day} events={eventsForDay} />;
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
  events: Event[]; // Add events prop to CalendarCell
}

const CalendarCell = ({ day, events }: CalendarCellProps) => {
  return (
    <div
      key={day.date.toISOString()}
      className={`relative border-[2px] font-fredoka border-onparOrange flex flex-col items-start p-1 hover:bg-onparOrange overflow-hidden
      ${!day.isCurrentMonth ? 'text-transparent' : ''}
      ${day.isToday ? 'text-black' : ''}
      `}
    >
      
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

      <p
      className={`${day.isCurrentMonth ? 'absolute top-1 left-1/2 transform -translate-x-1/2 w-[30px] h-[30px] rounded-full bg-onparOrange flex items-center justify-center text-sm' : ''}`}
      style={day.isToday ? {animation: 'blink 1s infinite', backgroundColor: 'bg-onparOrange'} : {}}
      >
        {getDate(day.date)}
      </p>

      {/* Events container */}
      <div className="flex flex-col gap-0.5 w-full mt-8 z-0">
        {events.map((event) => (
          <DisplayedEvent key={event._id} event={event} displayCurrentMonth={day.isCurrentMonth}/>
        ))}
      </div>
    </div>
  );
};

interface DisplayedEventProps {
  event: Event;
  displayCurrentMonth : boolean
}

const DisplayedEvent = ({ event, displayCurrentMonth }: DisplayedEventProps) => {
  // Map color number to Tailwind CSS background classes
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
    // Add more mappings as needed based on your color scheme
  };

  const colorClass = eventColors[event.color] || 'bg-black'; // Default color if not mapped

  // Format start time to "hh:mm am/pm"
  const formattedStartTime = event.startTime ? format(new Date(event.startTime), 'hh:mm a') : '';

  return (
    <div
    className={`${displayCurrentMonth ? "flex items-center gap-1 text-xs text-black text-[20px] p-0.5 rounded-md bg-opacity-80 w-full h-[50px] overflow-hidden whitespace-nowrap" : ''}`}>
      <div className={`${displayCurrentMonth ? `w-4 h-4 rounded-full flex-shrink-0 ${colorClass}` : ''}`}></div> {/* Color circle */}
      <p className="font-fredoka text-[15px] flex-shrink-0">{formattedStartTime}</p> {/* Hour and minute interval with AM/PM */}
      <p className="flex-shrink-0 text-[15px]">{event.title}</p> {/* Event title */}
    </div>
  );
};

export default WholeCalendar;