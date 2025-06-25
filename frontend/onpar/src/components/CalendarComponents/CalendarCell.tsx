
interface Props {
    dayNum: number
}

const CalendarCell = ({dayNum} : Props) => {
  return (
    <div key={dayNum} className="border-[2px] border-onparOrange py-8">
      Emotions
    </div>
  )
}

export default CalendarCell
