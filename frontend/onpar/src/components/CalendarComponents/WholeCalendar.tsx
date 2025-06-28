import CalendarHeading from "./CalendarHeading"
import CalendarGrid from "./CalendarGrid"
//50px

const WholeCalendar = () => {
  return (
    <div 
    className="relative border-[5px] border-onparOrange bg-onparLightYellow w-[753px] h-[670px] rounded-[40px] drop-shadow-lg" >
      
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
