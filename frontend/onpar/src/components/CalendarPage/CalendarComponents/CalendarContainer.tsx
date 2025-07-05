import WholeCalendar from "./WholeCalendar"
import CalendarMenu from "./CalendarMenu"

interface Props {
	ExitCalendar : (e : React.MouseEvent<HTMLButtonElement>) => void
}

const CalendarContainer = ({ExitCalendar} : Props) => {
  return (
    <div className="flex row w-screen h-screen bg-[#F9F3EF]">
				<CalendarMenu ExitCalendar={ExitCalendar}/>
				<WholeCalendar/>
    </div>
  )
}

export default CalendarContainer
