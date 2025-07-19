import WholeCalendar from "./WholeCalendar"
import DayCalendar from "./DayCalendar"
import WeekCalendar from "./WeekCalendar"
import CalendarMenu from "./CalendarMenu"
import { useState } from "react"
import EventForm from "../../EventsComponents/EventForm"

let View = "Month"

interface Props {
	ExitCalendar : (e : React.MouseEvent<HTMLButtonElement>) => void
}

const CalendarContainer = ({ExitCalendar} : Props) => {

  const [monthView, setMonthView] = useState(true)
  const [weekView, setWeekView] = useState(false)
  const [dayView, setDayView] = useState(false)
  const [eventForm, setEventForm] = useState(false)
  const [calendarMenu, setCalendarMenu] = useState(true)

  const MonthViewValid = (e : React.MouseEvent<HTMLButtonElement>) => {
    setMonthView(true)
    setDayView(false)
    setWeekView(false)
    View = "Month"
    e.stopPropagation()
  }

  const WeekViewValid = (e : React.MouseEvent<HTMLButtonElement>) => {
    setWeekView(true)
    setMonthView(false)
    setDayView(false)
    View = "Week"
    e.stopPropagation()
  }

  const DayViewValid = (e : React.MouseEvent<HTMLButtonElement>) => {
    setWeekView(false)
    setMonthView(false)
    setDayView(true)
    View = "Day"
    e.stopPropagation()
  }

  const CalendarMenuVisibility = (e : React.MouseEvent<HTMLButtonElement>) => {
    if(calendarMenu === false) {
      e.stopPropagation()
      setCalendarMenu(true)
      setEventForm(false)
    } else if(calendarMenu === true) {
      e.stopPropagation()
      setEventForm(true)
      setCalendarMenu(false)
    }
  }

  const exitEventForm = (e : React.FormEvent<HTMLFormElement>) => {
    if(calendarMenu === false) {
      e.stopPropagation()
      setCalendarMenu(true)
      setEventForm(false)
    }
  }

  return (
    <div className="flex row w-screen h-screen bg-[#F9F3EF]">

        {eventForm && <EventForm
          exitEventForm={exitEventForm} goToCalendarMenu={CalendarMenuVisibility}/>}

				{calendarMenu && <CalendarMenu 
          openEventForm={CalendarMenuVisibility}
          ExitCalendar={ExitCalendar} 
          DayView={DayViewValid} 
          WeekView={WeekViewValid} 
          MonthView={MonthViewValid} 
          currentView={View}/>
        }

				{monthView && <WholeCalendar/>}
        {dayView && <DayCalendar/>}
        {weekView && <WeekCalendar/>}
    </div>
  )
}

export default CalendarContainer
