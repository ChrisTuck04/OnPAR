import { useState } from "react"
import {AnimatePresence, motion} from "framer-motion"

interface Props {
  currentView? : string
  DayView : (e: React.MouseEvent<HTMLButtonElement>) => void
	WeekView : (e: React.MouseEvent<HTMLButtonElement>) => void
	MonthView : (e: React.MouseEvent<HTMLButtonElement>) => void 
}

const ViewSelection = ({currentView, DayView, WeekView, MonthView} : Props) => {

  const [open, setOpen] = useState(false)
  const showViewMenu = open && <ViewMenu DayView={DayView} WeekView={WeekView} MonthView={MonthView}/>

  return (
    <div className="relative flex flex-col justify-center items-center" onMouseEnter={() => {setOpen(true)}} onMouseLeave={() => {setOpen(false)}}>
      <p className="absolute text-[40px] font-fredoka">{currentView}</p>

      <span className="absolute top-[25px]">
        {showViewMenu}
      </span>
    </div>
  )
}

const ViewMenu = ({DayView, WeekView, MonthView} : Props) => {
  return (
    <AnimatePresence>
      <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1}}
      exit={{ opacity: 0}}
      className="relative flex flex-col gap-4 h-[200px] w-[280px] bottom-[1px] z-[9999] items-center justify-center bg-onparLightYellow border-[4px] border-onparOrange rounded-3xl text-[20px]"
      >
        <button onClick={DayView} className="h-[40px] w-[150px] border-[4px] border-onparOrange rounded-3xl hover:bg-onparOrange">
          <p>Day View</p>
        </button>

        <button onClick={WeekView} className="h-[40px] w-[150px] border-[4px] border-onparOrange rounded-3xl hover:bg-onparOrange">
          <p>Week View</p>
        </button>

        <button onClick={MonthView} className="h-[40px] w-[150px] border-[4px] border-onparOrange rounded-3xl hover:bg-onparOrange">
          <p>Month View</p>
        </button>
      </motion.div>
    </AnimatePresence>
  )
}

export default ViewSelection
