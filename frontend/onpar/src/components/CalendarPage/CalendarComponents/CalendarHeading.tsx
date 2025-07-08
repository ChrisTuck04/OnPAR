
const CalendarHeading = () => {

  const daysOfWeek = ['S','M','T','W','T','F','S']
  const months= ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  const left = "<<"
  const right = ">>"

  return (
    <div>
        <div className="relative grid grid-cols-3 text-center font-fredoka text-black top-[8px]" style={{WebkitTextStroke:"1px #FFAA00"}}>
            <button className="text-[25px] py-2">
              {left}
            </button>

            <div className="text-[35px]">
              {months[6]}
            </div>

            <button className="text-[25px] py-2">
              {right}
            </button>
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
