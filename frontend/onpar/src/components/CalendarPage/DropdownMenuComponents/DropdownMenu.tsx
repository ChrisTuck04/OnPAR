import LogoutButton from "../../Logout"


interface Props {
    CardVisibility: (e: React.MouseEvent<HTMLButtonElement>) => void
    CalendarVisibility: (e: React.MouseEvent<HTMLButtonElement>) => void
    ReflectionVisibility : (e: React.MouseEvent<HTMLButtonElement>) => void
    FriendsListVisibility: (e: React.MouseEvent<HTMLButtonElement>) => void
    CloseDropdownMenu : (e: React.MouseEvent<HTMLButtonElement>) => void
    
}

const DropdownMenu = ({CardVisibility, CalendarVisibility, ReflectionVisibility, FriendsListVisibility, CloseDropdownMenu} : Props) => {
  //const isLoggedIn = !!localStorage.getItem("token")
  //{isLoggedIn && <LogoutButton/>}

  return (
    <div className="absolute flex flex-col gap-y-4 items-center w-[220px] h-[670px] right-[4px] top-[4px] rounded-3xl bg-gray-500 border-[4px] border-gray-600 z-50">
            <div className="font-fredoka z-20 pt-4" style={{WebkitTextStroke: "1px #FFAA00"}}>
                <button className="w-[193px] h-[52px] hover:bg-onparOrange border-[3px] border-onparOrange bg-onparLightYellow rounded-2xl p-5 text-l" onClick={CardVisibility}>
                    <span className="relative bottom-[6px]">Emotions</span>
                </button>
            </div>

            <div className="font-fredoka z-20" style={{WebkitTextStroke: "1px #FFAA00"}}>
                <button className="w-[193px] h-[52px] hover:bg-onparOrange border-[3px] border-onparOrange bg-onparLightYellow rounded-2xl p-5 text-l" onClick={CalendarVisibility}>
                    <span className="relative bottom-[6px]">Calendar</span>
                </button>
            </div>

            <div className="font-fredoka z-20" style={{WebkitTextStroke: "1px #FFAA00"}}>
                <button className="w-[193px] h-[52px] hover:bg-onparOrange border-[3px] border-onparOrange bg-onparLightYellow rounded-2xl p-5 text-l" onClick={ReflectionVisibility}>
                    <span className="relative bottom-[6px]">Reflection</span>
                </button>
            </div>

            <div className="font-fredoka z-20" style={{WebkitTextStroke: "1px #FFAA00"}}>
                <button className="w-[193px] h-[52px] hover:bg-onparOrange border-[3px] border-onparOrange bg-onparLightYellow rounded-2xl p-5 text-l" onClick={FriendsListVisibility}>
                    <span className="relative bottom-[6px]">Friends</span>
                </button>
            </div>

            <div className="font-fredoka z-20" style={{WebkitTextStroke: "1px #FFAA00"}}>
                <LogoutButton/>
            </div>

            <div className="font-fredoka z-20" style={{WebkitTextStroke: "1px #FFAA00"}}>
                <button className="w-[193px] h-[52px] hover:bg-onparOrange border-[3px] border-onparOrange bg-onparLightYellow rounded-2xl p-5 text-l" onClick={CloseDropdownMenu}>
                    <span className="relative bottom-[6px]">^</span>
                </button>
            </div>
    </div>
  )
}

export default DropdownMenu
