import EmotionButton from "./EmotionButton"


interface Props{
    CardVisibility: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const EmotionCard = ({CardVisibility}: Props) => {
  return (
    <div className="relative flex items-center justify-center border-[5px] border-onparOrange bg-onparLightYellow w-[700px] h-[400px] rounded-[40px] font-fredoka" style={{WebkitTextStroke: "1px #FFAA00"}}>
        <p className="absolute top-[80px] text-[30px]">
            How are We Feeling Today?
        </p>

        <button className="absolute top-4 right-4 w-[120px] h-[50px] hover:bg-onparOrange border-[3px] border-onparOrange bg-onparLightYellow rounded-[30px]" onClick={CardVisibility}>
            close
        </button>

        <div className="grid grid-cols-4">
            <EmotionButton image="/assets/HappyEmotion.png" emotion="Happy" color="text-yellow" />
            <EmotionButton image="/assets/PleasantEmotion.png" emotion="Pleasant" color="text-red" />
            <EmotionButton image="/assets/SadEmotion.png" emotion="Sad" color="text-purple" />
            <EmotionButton image="/assets/AngryEmotion.png" emotion="Angry" color="text-red" />
        </div>
    </div>
  )
}

export default EmotionCard
