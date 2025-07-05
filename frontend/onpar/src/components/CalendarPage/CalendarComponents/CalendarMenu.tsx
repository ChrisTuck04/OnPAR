
interface Props {
	ExitCalendar : (e: React.MouseEvent<HTMLButtonElement>) => void
}

const CalendarMenu = ({ExitCalendar} : Props) => {
  return (
    <div className="h-full flex flex-col items-center w-[300px] bg-[#F9F3EF] border-[4px] border-[#D2C1B6] gap-4">
      <div className="flex w-full h-[100px] border-b-[4px] border-[#D2C1B6] overflow-hidden items-center justify-center">
        Month View
      </div>

			<button className="w-[280px] h-[70px] border-[5px] border-[#D2C1B6] py-[10px] rounded-3xl">
				Create Event
			</button>

      <button className="w-[280px] h-[70px] border-[5px] border-[#D2C1B6] py-[10px] rounded-3xl">
				Peronal Calendars
			</button>

			<button className="w-[280px] h-[70px] border-[5px] border-[#D2C1B6] py-[10px] rounded-3xl">
				Friend Calendars
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
