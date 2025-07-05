
const CalendarHeading = () => {

  const daysOfWeek = ['S','M','T','W','T','F','S']

  const left = "<<"
  const right = ">>"

  return (
    <div>
        <div className="relative grid grid-cols-3 text-center font-fredoka text-black top-[8px]" style={{WebkitTextStroke:"1px #FFAA00"}}>
            <div className="text-[25px] py-2 ">
              {left}
            </div>

            <div className="text-[35px]">
              June
            </div>

            <div className="text-[25px] py-2"> 
              {right}
            </div>
        </div>

        <div>
            <hr className="absolute w-full border-t-[4px] border-onparOrange top-[62px]"/>
            <hr className="absolute w-full border-t-[4px] border-onparOrange top-[110px]"/>
        </div>

         <div className="relative grid grid-cols-7 text-center font-fredoka text-lg text-black top-[6px] " style={{WebkitTextStroke:"1px #FFAA00"}}>
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
