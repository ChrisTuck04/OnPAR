
import GolfBackground from "../components/General/GolfBackground"
import CalendarContainer from "../components/CalendarPage/CalendarComponents/CalendarContainer.tsx";
import EmotionCard from "../components/CalendarPage/EmotionCardComponents/EmotionCard.tsx"
import HappyTheme from '../components/CalendarPage/HappyComponents/HappyTheme.tsx';
import SadTheme from '../components/CalendarPage/SadComponents/SadTheme.tsx';
import PleasantTheme from '../components/CalendarPage/PleasantComponents/PleasantTheme.tsx';
import AngryTheme from '../components/CalendarPage/AngryComponents/AngryTheme.tsx';
import DropdownMenu from '../components/CalendarPage/DropdownMenuComponents/DropdownMenu.tsx';
import DropdownButton from '../components/CalendarPage/DropdownMenuComponents/DropdownButton.tsx';
import { useState, useEffect } from 'react';
import dayjs from "dayjs";
import type { User } from "../types/User"
import type { Emotions } from "../types/Emotions.ts";
import type { Events } from "../types/Events.ts"

const CalendarPage = () => {
  const [emotionCard, setEmotionCard] = useState(true)
  const [calendar, setCalendar] = useState(false)
  const [happyTheme, setHappyTheme] = useState(false);
  const [sadTheme, setSadTheme] = useState(false);
  const [pleasantTheme, setPleasantTheme] = useState(true);
  const [angryTheme, setAngryTheme] = useState(false);
  const [dropdownMenu, setDropdownMenu] = useState(false)
  const [menuButton, setMenuButton] = useState(false)

  /*these are the useStates for user object, all
   emotions of the user per day they logged it,
   and events list that holds all the events the
   user made. Will need to parse the events list
   even further when adding events to the */
  const [emotions, setEmotions] = useState<Emotions[]>([])
  const [events, setEvents] = useState<Events[]>([])
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
  
  }, [])

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

  return (
      <div className="min-h-screen flex items-center justify-center">

        <DateTimeHeader/> 
        <WelcomeHeader name="Andres"/>

        <div className="fixed snap-center z-30">
          {calendar && <CalendarContainer ExitCalendar={CalendarVisibility}/>}
        </div>

        <div className="fixed bottom-0 w-screen z-[5]">
          <GolfBackground/>
        </div>

        <div className="fixed snap-center z-40">
          {emotionCard && <EmotionCard Happy={Happy} Pleasant={Pleasant} Sad={Sad} Angry={Angry}/>}
        </div>

        <div>
          {menuButton && <DropdownButton OpenDropdownMenu={OpenDropdownMenu}/>}
          {dropdownMenu && <DropdownMenu 
          CardVisibility={CardVisibility} 
          CalendarVisibility={CalendarVisibility} 
          ReflectionVisibility={()=> null} 
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

interface Props {
  name: string
}

const WelcomeHeader = ({name} : Props) => {
  return (
    <div className="fixed flex flex-col items-center w-full h-full top-[100px] text-white font-fredoka text-[65px] z-[25]"
          style={{WebkitTextStroke: "1px #D2C1B6"}}>
      <p className="flex items-center justify-center w-[800px] h-[100px]">Welcome {name}</p>
    </div>
  )
}

export default CalendarPage