
const CalendarHeading = () => {

  const daysOfWeek = ['S','M','T','W','T','F','S']

  return (
    <div>
        <div className="absolute top-[15px] left-1/2 transform -translate-x-1/2">
            <span className="font-fredoka text-[60px] text-black" style={{WebkitTextStroke:"1px #FFAA00"}}>Calendar</span>
        </div>

        <div>
            <hr className="absolute w-full border-t-[4px] border-onparOrange top-[102px]"/>
            <hr className="absolute w-full border-t-[4px] border-onparOrange top-[150px]"/>
        </div>

         <div className="relative grid grid-cols-7 text-center font-fredoka text-lg text-black top-[105px] " style={{WebkitTextStroke:"1px #FFAA00"}}>
        {daysOfWeek.map((day, index) => (
          <div key={index} className="border-[2px] border-onparOrange py-2 px-[40px]">
            {day}
          </div>
        ))}
      </div>

    </div>
  )
}

export default CalendarHeading
