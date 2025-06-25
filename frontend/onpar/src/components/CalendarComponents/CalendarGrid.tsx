import CalendarCell from "./CalendarCell" 


const CalendarGrid = () => {
  return (
    <div className="relative grid grid-cols-7 justify-center text-center text-black text-fredoka top-[103px] rounded-b-[28px] overflow-hidden">
        {[...Array(35)].map((_,index) => (
            <CalendarCell dayNum={index}/>
        ))}
    </div>
  )
}

export default CalendarGrid
