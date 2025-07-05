
import GolfBackground from "../components/General/GolfBackground"
import CalendarContainer from "../components/CalendarPage/CalendarComponents/CalendarContainer.tsx";
import EmotionCard from "../components/CalendarPage/EmotionCardComponents/EmotionCard.tsx"
import HappyTheme from '../components/CalendarPage/HappyComponents/HappyTheme.tsx';
import SadTheme from '../components/CalendarPage/SadComponents/SadTheme.tsx';
import PleasantTheme from '../components/CalendarPage/PleasantComponents/PleasantTheme.tsx';
import AngryTheme from '../components/CalendarPage/AngryComponents/AngryTheme.tsx';
import DropdownMenu from '../components/CalendarPage/DropdownMenuComponents/DropdownMenu.tsx';
import DropdownButton from '../components/CalendarPage/DropdownMenuComponents/DropdownButton.tsx';
import { useState } from 'react';


const CalendarPage = () => {
  const [emotionCard, setEmotionCard] = useState(true)
  const [calendar, setCalendar] = useState(false)
  const [happyTheme, setHappyTheme] = useState(false);
  const [sadTheme, setSadTheme] = useState(false);
  const [pleasantTheme, setPleasantTheme] = useState(true);
  const [angryTheme, setAngryTheme] = useState(false);
  const [dropdownMenu, setDropdownMenu] = useState(false)
  const [menuButton, setMenuButton] = useState(false)

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

export default CalendarPage