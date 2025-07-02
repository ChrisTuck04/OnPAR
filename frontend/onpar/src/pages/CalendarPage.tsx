import LogoutButton from '../components/Logout.tsx';
import GolfBackground from "../components/General/GolfBackground"
import WholeCalendar from "../components/CalendarComponents/WholeCalendar"
import EmotionCard from "../components/EmotionCardComponents/EmotionCard.tsx"
import HappyTheme from '../components/HappyComponents/HappyTheme.tsx';
import SadTheme from '../components/SadComponents/SadTheme.tsx';
import PleasantTheme from '../components/PleasantComponents/PleasantTheme.tsx';
import AngryTheme from '../components/AngryComponents/AngryTheme.tsx';
import { useState } from 'react';


const CalendarPage = () => {
  const isLoggedIn = !!localStorage.getItem("token")

  const [emotionCard, setEmotionCard] = useState(true)
  const [calendar, setCalendar] = useState(false)
  const [happyTheme, setHappyTheme] = useState(false);
  const [sadTheme, setSadTheme] = useState(false);
  const [pleasantTheme, setPleasantTheme] = useState(true);
  const [angryTheme, setAngryTheme] = useState(false);

  const CloseCard = (e: React.MouseEvent<HTMLButtonElement>) => {
    setEmotionCard(false)
    e.stopPropagation()
  }

  const CardVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
    if(emotionCard === true)
      setEmotionCard(false)
    else if(emotionCard == false)
      setEmotionCard(true)
    setCalendar(false)
    e.stopPropagation()
  }

  const CalendarVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
    if(calendar === true)
      setCalendar(false)
    else if(calendar === false && emotionCard === false)
      setCalendar(true)
    e.stopPropagation()
  }

  const Happy = (e : React.MouseEvent<HTMLButtonElement>) => {
      setHappyTheme(true)
      setAngryTheme(false)
      setPleasantTheme(false)
      setSadTheme(false)
      e.stopPropagation()
  }

  const Sad = (e : React.MouseEvent<HTMLButtonElement>) => {
      setHappyTheme(false)
      setAngryTheme(false)
      setPleasantTheme(false)
      setSadTheme(true)
      e.stopPropagation()
  }

  const Pleasant = (e : React.MouseEvent<HTMLButtonElement>) => {
      setHappyTheme(false)
      setAngryTheme(false)
      setPleasantTheme(true)
      setSadTheme(false)
      e.stopPropagation()
  }

  const Angry = (e : React.MouseEvent<HTMLButtonElement>) => {
      setHappyTheme(false)
      setAngryTheme(true)
      setPleasantTheme(false)
      setSadTheme(false)
      e.stopPropagation()
  }

  return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="fixed snap-center z-40">
          {calendar && <WholeCalendar/>}
        </div>

        <div className="fixed bottom-0 w-screen z-[5]">
          <GolfBackground/>
        </div>

        <div className="absolute top-4 right-4">
          {isLoggedIn && <LogoutButton />}
        </div>

        <div className="fixed snap-center z-50">
          {emotionCard && <EmotionCard CardVisibility={CloseCard} Happy={Happy} Pleasant={Pleasant} Sad={Sad} Angry={Angry}/>}
        </div>

        <div className="absolute top-4 right-4 font-fredoka z-20" style={{WebkitTextStroke: "1px #FFAA00"}}>
          <button className="w-[193px] h-[52px] hover:bg-onparOrange border-[3px] border-onparOrange bg-onparLightYellow rounded-2xl p-5 text-l" onClick={CardVisibility}>
            <span className="relative bottom-[6px]">Emotions</span>
          </button>
        </div>

        <div className="absolute top-20 right-4 font-fredoka z-20" style={{WebkitTextStroke: "1px #FFAA00"}}>
          <button className="w-[193px] h-[52px] hover:bg-onparOrange border-[3px] border-onparOrange bg-onparLightYellow rounded-2xl p-5 text-l" onClick={CalendarVisibility}>
            <span className="relative bottom-[6px]">Calendar</span>
          </button>
        </div>

        {happyTheme && <HappyTheme/>}
        {sadTheme && <SadTheme/>}
        {pleasantTheme && <PleasantTheme/>}
        {angryTheme && <AngryTheme/>}
      </div>
  )
}

export default CalendarPage