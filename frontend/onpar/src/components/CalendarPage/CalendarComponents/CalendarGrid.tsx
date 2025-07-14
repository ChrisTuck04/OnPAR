import CalendarCell from "./CalendarCell" 


const CalendarGrid = () => {
  return (
    <div className="relative grid grid-cols-7 justify-center text-center text-black text-fredoka top-[6px] rounded-b-[30px]">
        {[...Array(42)].map((_,index) => (
            <CalendarCell dayNum={index}/>
        ))}
    </div>
  )
}

export default CalendarGrid
