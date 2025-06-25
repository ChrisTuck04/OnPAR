
const CalendarHeading = () => {
  return (
    <div>
        <div className="absolute top-[15px] left-1/2 transform -translate-x-1/2">
            <span className="font-fredoka text-[60px] text-onparOrange">Calender</span>
        </div>

        <div>
            <hr className="absolute w-full border-t-[5px] border-onparOrange top-[110px]"/>
            <hr className="absolute w-full border-t-[5px] border-onparOrange top-[160px]"/>
        </div>

        <div className="absolute w-full grid grid-cols-7 gap-[5px] border-onparOrange top-[170px]">
            {[...Array(7)].map((_, i) => (
    <div key={i} className="border border-gray-400 h-20 flex items-center justify-center">
      {i + 1}
    </div>
  ))}
        </div>
    </div>
  )
}

export default CalendarHeading
