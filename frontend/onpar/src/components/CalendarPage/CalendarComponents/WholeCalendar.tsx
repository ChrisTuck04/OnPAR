import { useState } from 'react';
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

const WholeCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const goToPreviousMonth = () => {
    setCurrentDate((prevDate) => subMonths(prevDate, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate((prevDate) => addMonths(prevDate, 1));
  };

  return (
    <div className="flex flex-col h- w-full bg-onparLightYellow border-onparOrange border-[5px] rounded-[40px] overflow-hidden">
      <CalendarHeading
        currentDate={currentDate}
        goToPreviousMonth={goToPreviousMonth}
        goToNextMonth={goToNextMonth}
      />
      {/* CalendarGrid now takes up the remaining height */}
      <CalendarGrid currentDate={currentDate} />
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
    <div>
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
}

const CalendarGrid = ({ currentDate }: CalendarGridProps) => {
  const days = [];

  const monthStart = startOfMonth(currentDate);
  const numDaysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonthWeekday = getDay(monthStart);

  const numLeadingEmptyCells = firstDayOfMonthWeekday;
  const numTrailingEmptyCells = 42 - (numLeadingEmptyCells + numDaysInMonth);

  const prevMonthLastDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    0
  );
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
    <div className="grid grid-cols-7 flex-grow justify-center text-center text-black text-fredoka rounded-b-[30px] overflow-hidden w-full">
      {days.map((day, index) => (
        <CalendarCell key={index} day={day} />
      ))}
    </div>
  );
};

interface CalendarCellProps {
  day: {
    date: Date;
    isCurrentMonth: boolean;
    isToday: boolean;
  };
}

const CalendarCell = ({ day }: CalendarCellProps) => {
  return (
    <div
      key={day.date.toISOString()}
      className={`relative border-[2px] font-fredoka border-onparOrange flex items-center justify-center p-1 hover:bg-onparOrange w-full aspect-square
      ${!day.isCurrentMonth ? 'text-transparent' : ''}
      ${day.isToday ? 'text-black' : ''}
      `}
      style={day.isToday ? {animation: 'blink 1s infinite', backgroundColor: 'bg-onparOrange'} : {}}
    >

      <style>
        {`
          @keyframes blink {
            0%   { background-color: onparLightYellow; }
            25%  { background-color: #FCD848}
            50%  { background-color: #FDC930; }
            75%  { background-color: #FEB918}
            100% { background-color: #FFA500; }
          }
        `}
        </style>

      <p
      className={`${day.isCurrentMonth ? 'absolute top-1 left-1/2 transform -translate-x-1/2 w-[30px] h-[30px] rounded-full bg-onparOrange flex items-center justify-center text-sm' : ''}`}>
        {getDate(day.date)}
      </p>
      {/* Placeholder for emotions/events - will be implemented later */}
    </div>
  );
};

export default WholeCalendar;
