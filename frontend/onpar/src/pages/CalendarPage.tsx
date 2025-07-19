
import GolfBackground from "../components/General/GolfBackground"
import CalendarContainer from "../components/CalendarPage/CalendarComponents/CalendarContainer.tsx";
import EmotionCard from "../components/CalendarPage/EmotionCard/JournalComponents/EmotionCard.tsx"
import HappyTheme from '../components/CalendarPage/HappyComponents/HappyTheme.tsx';
import SadTheme from '../components/CalendarPage/SadComponents/SadTheme.tsx';
import PleasantTheme from '../components/CalendarPage/PleasantComponents/PleasantTheme.tsx';
import AngryTheme from '../components/CalendarPage/AngryComponents/AngryTheme.tsx';
import DropdownMenu from '../components/CalendarPage/DropdownMenuComponents/DropdownMenu.tsx';
import DropdownButton from '../components/CalendarPage/DropdownMenuComponents/DropdownButton.tsx';
import { useState, useEffect } from 'react';
import {motion, AnimatePresence} from "framer-motion"
// @ts-expect-error axios functions in js
import { getUser } from "../api/auth"
import type { AxiosError } from "axios";


const CalendarPage = () => {
  const [emotionCard, setEmotionCard] = useState(true)
  const [calendar, setCalendar] = useState(false)
  const [happyTheme, setHappyTheme] = useState(false);
  const [sadTheme, setSadTheme] = useState(false);
  const [pleasantTheme, setPleasantTheme] = useState(true);
  const [angryTheme, setAngryTheme] = useState(false);
  const [dropdownMenu, setDropdownMenu] = useState(false)
  const [menuButton, setMenuButton] = useState(false)
  const [userName, setUserName] = useState("")
  const [openJournal, setOpenJournal] = useState<boolean>(false)

  const CardVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
    if(emotionCard === true)
      setEmotionCard(false)
    else if(emotionCard == false)
    {
      setEmotionCard(true)
      setDropdownMenu(false)
    }
    setCalendar(false)
    e.stopPropagation()
  }

  const CalendarVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
    if(calendar === true)
    {
      setCalendar(false)
      setMenuButton(true)
    }
    else if(calendar === false && emotionCard === false)
    {
      setCalendar(true)
      setDropdownMenu(false)
    }
    e.stopPropagation()
  }

  const OpenDropdownMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    setDropdownMenu(true)
    setMenuButton(false)
    e.stopPropagation()
  }

  const CloseDropdownMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    setDropdownMenu(false)
    setMenuButton(true)
    e.stopPropagation()
  }

  const Happy = (e : React.MouseEvent<HTMLButtonElement>) => {
      setHappyTheme(true)
      setAngryTheme(false)
      setPleasantTheme(false)
      setSadTheme(false)
      setEmotionCard(false)
      setMenuButton(true)
      e.stopPropagation()
  }

  const Sad = (e : React.MouseEvent<HTMLButtonElement>) => {
      setHappyTheme(false)
      setAngryTheme(false)
      setPleasantTheme(false)
      setSadTheme(true)
      setEmotionCard(false)
      setMenuButton(true)
      e.stopPropagation()
  }

  const Pleasant = (e : React.MouseEvent<HTMLButtonElement>) => {
      setHappyTheme(false)
      setAngryTheme(false)
      setPleasantTheme(true)
      setSadTheme(false)
      setEmotionCard(false)
      setMenuButton(true)
      e.stopPropagation()
  }

  const Angry = (e : React.MouseEvent<HTMLButtonElement>) => {
      setHappyTheme(false)
      setAngryTheme(true)
      setPleasantTheme(false)
      setSadTheme(false)
      setEmotionCard(false)
      setMenuButton(true)
      e.stopPropagation()
  }

  const fetchUserName = async () => {
    try {
      const user = await getUser()
      setUserName(user.firstName)
    } catch (err : unknown) {
      const error = err as AxiosError<{error : string}>
      alert(error.response?.data?.error || "retrieving user first name failed")
    }
  }

  useEffect(() => {
    fetchUserName()
  }, [])

  // Log the state whenever it changes
    useEffect(() => {
    console.log("EmotionCard: openJournal state is now:", openJournal);
    }, [openJournal]);
  
    const toggleJournalVisibility = (e : React.MouseEvent<HTMLButtonElement>) => {
      setOpenJournal((prevOpenJournal) => {
        console.log("toggleJournalVisibility: Toggling from", prevOpenJournal, "to", !prevOpenJournal)
        return !prevOpenJournal
      })
      e.stopPropagation()
    }

  return (
      <div className="min-h-screen flex items-center justify-center">

        <WelcomeHeader name={userName}/>

        <div className="fixed snap-center z-30">
          {calendar && <CalendarContainer ExitCalendar={CalendarVisibility}/>}
        </div>

        <div className="fixed bottom-0 w-screen z-[5]">
          <GolfBackground/>
        </div>

        <div className="fixed snap-center z-40">
          {emotionCard && 
          <EmotionCard 
          Happy={Happy}
          Pleasant={Pleasant}
          Sad={Sad} 
          Angry={Angry}
          toggleJournalView={toggleJournalVisibility}
          journalValid={openJournal}/>}
        </div>

        <AnimatePresence>
					{openJournal &&
          <Journal
          onCloseJournal={toggleJournalVisibility}
          openMenuButton={() => setMenuButton(true)}
          />}
				</AnimatePresence>

        <div>
          {menuButton && <DropdownButton OpenDropdownMenu={OpenDropdownMenu}/>}
          {dropdownMenu && <DropdownMenu 
          CardVisibility={CardVisibility} 
          CalendarVisibility={CalendarVisibility} 
          ReflectionVisibility={toggleJournalVisibility} 
          FriendsListVisibility={()=> null}
          CloseDropdownMenu={CloseDropdownMenu}/>}
        </div>

        <div>
          {happyTheme && <HappyTheme/>}
          {sadTheme && <SadTheme/>}
          {pleasantTheme && <PleasantTheme/>}
          {angryTheme && <AngryTheme/>}
        </div>  
      </div>
  )
}

/*
const DateTimeHeader = () => {

  const [currTime, setCurrTime] = useState(dayjs())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrTime(dayjs())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed w-full h-full flex flex-col items-center top-[200px] text-[60px] font-fredoka text-white z-[25]"
          style={{WebkitTextStroke: "1px #D2C1B6"}}>
      <p className="flex justify-center items-center w-[800px] h-[100px]">Today is {currTime.format("dddd")}</p>
      <p className="flex justify-center items-center w-[800px] h-[100px]">{currTime.format("MMMM D, YYYY")}</p>
      <p className="flex justify-center items-center w-[600px] h-[100px]">{currTime.format("hh:mm A")}</p>
    </div>
  )
}
*/

interface WelcomeHeaderProps {
  name: string
}

const WelcomeHeader = ({name} : WelcomeHeaderProps) => {
  return (
    <div className="fixed flex flex-col items-center w-full h-full top-[100px] text-white font-fredoka text-[65px] z-[25]"
          style={{WebkitTextStroke: "1px #D2C1B6"}}>
      <p className="flex items-center justify-center w-[800px] h-[100px]">Welcome {name}!</p>
    </div>
  )
}

interface JournalProps {
  onCloseJournal: (e : React.MouseEvent<HTMLButtonElement>) => void;
  openDropdownMenu? : () => void
  openMenuButton : () => void
}

const Journal = ({ onCloseJournal}: JournalProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  return (
    <motion.div
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      exit={{ scaleX: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50"
    >
      <motion.div
        className="flex w-[700px] h-[400px] bg-white rounded-[40px] shadow-xl origin-left overflow-hidden"
      >
        {/* Left Page */}
        <div className="w-1/2 p-6 border-r-2 border-gray-300 bg-onparLightYellow font-fredoka">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-2xl font-bold bg-transparent border-b-2 border-gray-400 focus:outline-none placeholder-gray-500"
          />
          <textarea
            placeholder="Write your thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-4 w-full h-64 bg-transparent resize-none focus:outline-none text-lg"
          />
        </div>

        {/* Right Page */}
        <div className="w-1/2 p-6 flex items-start justify-end bg-onparLightYellow">
          <button
            onClick={(e) => {
              onCloseJournal(e)
              }}
            className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default CalendarPage