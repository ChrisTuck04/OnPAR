import { useState } from "react"

interface Props {
  currentView : string
  DayView : (e: React.MouseEvent<HTMLButtonElement>) => void
	WeekView : (e: React.MouseEvent<HTMLButtonElement>) => void
	MonthView : (e: React.MouseEvent<HTMLButtonElement>) => void 
}

const ViewSelection = ({currentView, DayView, WeekView, MonthView} : Props) => {

  const [open, setOpen] = useState(false)
  const showViewMenu = open && <ViewMenu DayView={DayView} WeekView={WeekView} MonthView={MonthView}/>

  return (
    <div onMouseEnter={() => {setOpen(true)}} onMouseLeave={() => {setOpen(false)}}>
      <p>{currentView}</p>
      <span>
        {showViewMenu}
      </span>
    </div>
  )
}

interface Prop {
  DayView : (e: React.MouseEvent<HTMLButtonElement>) => void
	WeekView : (e: React.MouseEvent<HTMLButtonElement>) => void
	MonthView : (e: React.MouseEvent<HTMLButtonElement>) => void 
}

const ViewMenu = ({DayView, WeekView, MonthView} : Prop) => {
  return (
    <div>
    <button onClick={DayView}>
      <p>Day View</p>
    </button>

    <button onClick={WeekView}>
      <p>Week View</p>
    </button>

    <button onClick={MonthView}>
      <p>Month View</p>
    </button>
  </div>
  )
}

export default ViewSelection
