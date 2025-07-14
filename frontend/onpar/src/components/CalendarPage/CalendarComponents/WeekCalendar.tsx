
const WeekCalendar = () => {
  return (
    <div className="relative bg-onparLightYellow border-[4px] border-onparOrange w-full h-full rounded-[40px]">
      <WeekHeading/>
      <WeekGrid/>
    </div>
  )
}

const WeekHeading = () => {

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

      <div className="relative grid grid-cols-7 text-center font-fredoka text-lg text-black top-[8px] " style={{WebkitTextStroke:"1px #FFAA00"}}>
        {daysOfWeek.map((day, index) => (
          <div key={index} className="border-[2px] border-onparOrange py-2 px-[40px]">
            {day}
          </div>
        ))}
      </div>

    </div>
    
  )
}

const WeekGrid = () => {
  return (
    <div className="absolute grid grid-cols-7 h-[570px] top-[108px] w-full rounded-bl-[40px] rounded-br-[40px] overflow-hidden">
      {[...Array(7)].map((_,index) => (
        <WeekCell key={index}/>
      ))}
    </div>
  )
}

const WeekCell = () => {
  return (
    <div className="flex items-center justify-center border-[3px] border-onparOrange h-full">
      Day
    </div>
  )
}

export default WeekCalendar
