import LogoutButton from '../components/Logout.tsx';

const CalendarPage = () => {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div>
        <header className="flex justify-between p-4 bg-gray-100">
          <h1 className="text-xl">My Calendar</h1>
          {isLoggedIn && <LogoutButton />}
        </header>
      </div>
    </div>
  )
}

export default CalendarPage