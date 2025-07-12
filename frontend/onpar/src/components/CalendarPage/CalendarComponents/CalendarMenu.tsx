import ViewSelection from "./ViewSelection"
interface Props {
	openEventForm: (e: React.MouseEvent<HTMLButtonElement>) => void
	ExitCalendar : (e: React.MouseEvent<HTMLButtonElement>) => void
	DayView : (e: React.MouseEvent<HTMLButtonElement>) => void
	WeekView : (e: React.MouseEvent<HTMLButtonElement>) => void
	MonthView : (e: React.MouseEvent<HTMLButtonElement>) => void 
	currentView : string
}

const CalendarMenu = ({openEventForm, ExitCalendar, DayView, WeekView, MonthView, currentView} : Props) => {
  return (
    <div
		className="h-full flex flex-col items-center w-[300px] bg-[#F9F3EF] border-[4px] border-[#D2C1B6] gap-4 font-fredoka text-[25px] rounded-tr-3xl rounded-br-3xl"
		style={{WebkitTextStroke:"1px #D2C1B6"}}>
      <div className="relative flex w-full h-[100px] border-b-[4px] border-[#D2C1B6] items-center justify-center">
        <ViewSelection currentView={currentView} DayView={DayView} WeekView={WeekView} MonthView={MonthView}/>
      </div>

			<button
			className="w-[280px] h-[70px] border-[5px] border-[#D2C1B6] py-[10px] rounded-3xl"
			onClick={openEventForm}>
				Create Event
			</button>

			<button className="w-[280px] h-[70px] border-[5px] border-[#D2C1B6] py-[10px] rounded-3xl">
				Share a Calendar
			</button>
			
			<button
			className="w-[280px] h-[70px] border-[5px] border-[#D2C1B6] py-[10px] rounded-3xl"
			onClick={ExitCalendar}
			>
				Exit
			</button>

    </div>
  )
}

export default CalendarMenu
