import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"

interface Props{
    Happy: (e: React.MouseEvent<HTMLButtonElement>) => void
    Pleasant: (e: React.MouseEvent<HTMLButtonElement>) => void
    Sad: (e: React.MouseEvent<HTMLButtonElement>) => void
    Angry: (e: React.MouseEvent<HTMLButtonElement>) => void
		toggleJournalView : (e : React.MouseEvent<HTMLButtonElement>) => void
		journalValid : boolean
}

const EmotionCard = ({Happy, Pleasant, Sad, Angry, toggleJournalView, journalValid}: Props) => {
    return (
			<div className="flex items-center justify-center border-[10px] border-onparOrange bg-onparLightYellow w-[700px] h-[400px] rounded-[40px] font-fredoka">
				<p className="absolute top-[80px] text-[30px]" style={{WebkitTextStroke: "1px #FFAA00"}}>
						How are We Feeling Today?
				</p>

				<div className="absolute grid grid-cols-4 ">
						
					<EmotionButton
					image="/assets/HappyEmotion.png"
					emotion="Happy"
					color="text-orange-500"
					ThemeChange={Happy}
					openJournal={toggleJournalView}/>

					<EmotionButton
					image="/assets/PleasantEmotion.png"
					emotion="Pleasant"
					color="text-green-600"
					ThemeChange={Pleasant}
					openJournal={toggleJournalView}/>

					<EmotionButton
					image="/assets/SadEmotion.png"
					emotion="Sad"
					color="text-blue-600"
					ThemeChange={Sad}
					openJournal={toggleJournalView}/>

					<EmotionButton
					image="/assets/AngryEmotion.png"
					emotion="Angry"
					color="text-red-600"
					ThemeChange={Angry}
					openJournal={toggleJournalView}/> 
						
				</div>
			</div>
    )
}

interface ButtonProps{
  image: string
  emotion: string
  color: string
  ThemeChange? : (e: React.MouseEvent<HTMLButtonElement>) => void
openJournal : (e : React.MouseEvent<HTMLButtonElement>) => void
}

const EmotionButton = ({image, emotion, color, ThemeChange, openJournal}: ButtonProps) => {
  return (
    <div className="flex items-center justify-center font-fredoka">
      <button
			className="relative top-[10px] m-3 p-7 rounded-[70px] h-[130px] border-[6px] border-onparOrange bg-black"
			onClick={(e) => {
				openJournal(e)
				ThemeChange && ThemeChange(e)
				}}>
        <img className="relative bottom-[6px] w-[80px] h-[80px]" src={image} alt="image" />
      </button>

      <p className={`absolute ${color} top-[180px] text-2xl`}>
        {emotion}
      </p>

    </div>
  )
}

export default EmotionCard
