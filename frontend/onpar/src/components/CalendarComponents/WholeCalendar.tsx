import CalendarHeading from "./CalendarHeading"
import CalendarGrid from "./CalendarGrid"
//50px

const WholeCalendar = () => {
  return (
    <div 
    className="relative border-[5px] border-onparOrange bg-onparLightYellow min-w-[753px] min-h-[670px] max-w-[1053px] max-h-[970px] rounded-[40px] drop-shadow-lg" >
      
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
