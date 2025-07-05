import CalendarHeading from "./CalendarHeading"
import CalendarGrid from "./CalendarGrid"
//50px

const WholeCalendar = () => {
  return (
    <div className="flex-auto h-full bg-onparLightYellow border-onparOrange border-[5px] rounded-[40px]">
      <CalendarHeading/>
      <CalendarGrid/>
    </div>
  )
}

export default WholeCalendar
