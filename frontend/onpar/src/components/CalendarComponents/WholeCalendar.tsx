import CalendarHeading from "./CalendarHeading"
import CalendarGrid from "./CalendarGrid"

const WholeCalendar = () => {
  return (
    <div 
    className="relative border-[5px] border-onparOrange bg-onparLightYellow w-[703px] h-[620px] rounded-[40px] top-[15px]" >
      
      <div>
        <CalendarHeading/>
      </div>

      <div>
        <CalendarGrid/>
      </div>



    </div>
  )
}

export default WholeCalendar
