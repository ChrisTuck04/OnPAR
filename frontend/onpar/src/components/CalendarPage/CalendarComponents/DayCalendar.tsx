

const DayCalendar = () => {
  return (
    <div className="relative bg-onparLightYellow border-[4px] border-onparOrange w-full h-full rounded-[40px]">
      <DayHeading/>
    </div>
  )
}

const DayHeading = () => {

  const days= ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  const left = "<<"
  const right = ">>"

  return (
    <div>
      <div className="relative grid grid-cols-3 text-center font-fredoka text-black top-[8px]" style={{WebkitTextStroke:"1px #FFAA00"}}>
        <button className="text-[25px] py-2">
          {left}
        </button>

        <div className="text-[35px]">
          {days[1]}
        </div>

        <button className="text-[25px] py-2">
          {right}
        </button>
      </div>
    </div>
  )
}
export default DayCalendar
