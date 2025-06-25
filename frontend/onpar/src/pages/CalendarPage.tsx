import LogoutButton from '../components/Logout.tsx';
import GolfBackground from "../components/General/GolfBackground"
import WholeCalendar from "../components/CalendarComponents/WholeCalendar"

const CalendarPage = () => {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center">
        <div className="fixed bottom-11 z-10">
          <WholeCalendar/>
        </div>

        <div className="fixed bottom-0 w-screen">
          <GolfBackground/>
        </div>

        <div className="absolute top-4 right-4">
          {isLoggedIn && <LogoutButton />}
        </div>
      </div>
    </div>
  )
}

export default CalendarPage