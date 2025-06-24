import LogoutButton from '../components/Logout.tsx';
import GolfBackground from "../components/General/GolfBackground"
import YellowButton from "../components/General/YellowButton"
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
        <YellowButton to="/" text="Logout"/>
        </div>
      </div>
      <div className="min-h-screen flex items-center justify-center">
        <div>
          <header className="flex justify-between p-4 bg-gray-100">
            <h1 className="text-xl">My Calendar</h1>
            {isLoggedIn && <LogoutButton />}
          </header>
        </div>
      </div>
    </div>
  )
}

export default CalendarPage