import GolfBackground from "../components/General/GolfBackground"
import YellowButton from "../components/General/YellowButton"
import WholeCalendar from "../components/CalendarComponents/WholeCalendar"

const CalendarPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">

      <div className="fixed bottom-11 z-10">
        <WholeCalendar/>
      </div>

      <div className="fixed bottom-0 w-screen">
        <GolfBackground/>
      </div>

      <div className="absolute top-4 right-4">
      <YellowButton to="/" text="Logout"/>
      </div>
    </div>
  )
}

export default CalendarPage