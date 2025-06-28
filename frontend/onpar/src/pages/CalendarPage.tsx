import LogoutButton from '../components/Logout.tsx';
import GolfBackground from "../components/General/GolfBackground"
import WholeCalendar from "../components/CalendarComponents/WholeCalendar"
import EmotionCard from "../components/EmotionCardComponents/EmotionCard.tsx"
import { useState } from 'react';

const CalendarPage = () => {
  const isLoggedIn = !!localStorage.getItem("token")

  const [emotionCard, setEmotionCard] = useState(true)
  const [calendar, setCalendar] = useState(false)

  const CloseCard = (e: React.MouseEvent<HTMLButtonElement>) => {
    setEmotionCard(false)
    setCalendar(true)
    e.stopPropagation()
  }

  const OpenCard = (e: React.MouseEvent<HTMLButtonElement>) => {
    setEmotionCard(true)
    setCalendar(false)
    e.stopPropagation()
  }

  /*
  const CloseCalendar = (e: React.MouseEvent<HTMLButtonElement>) => {
    setCalendar(false)
    e.stopPropagation()
  }
  */

  /*
  const OpenCalendar = (e: React.MouseEvent<HTMLButtonElement>) => {
    setCalendar(true)
    e.stopPropagation()
  }
  */

  return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="fixed snap-center z-10">
          {calendar && <WholeCalendar/>}
        </div>

        <div className="fixed bottom-0 w-screen">
          <GolfBackground/>
        </div>

        <div className="absolute top-4 right-4">
          {isLoggedIn && <LogoutButton />}
        </div>

        <div className="fixed snap-center z-20">
          {emotionCard && <EmotionCard CardVisibility={CloseCard}/>}
        </div>

        <div className="absolute top-4 right-4 font-fredoka" style={{WebkitTextStroke: "1px #FFAA00"}}>
          <button className="w-[193px] h-[52px] hover:bg-onparOrange border-[3px] border-onparOrange bg-onparLightYellow rounded-2xl p-5 text-l" onClick={OpenCard}>
            <span className="relative bottom-[6px]">Emotions</span>
          </button>
        </div>
      </div>
  )
}

export default CalendarPage